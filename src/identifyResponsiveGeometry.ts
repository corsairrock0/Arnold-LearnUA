// ============================================================================
// Lango Universal Identify Responsive Geometry & Coordinate Projection Engine
// ============================================================================
// Source of Truth: All object annotations are stored in normalized original-image
// coordinates (0.0 to 1.0). This module computes the exact rendered image box
// inside any container (accounting for object-fit: contain | cover | fill,
// letterboxing, aspect-ratio differences, padding, zoom, and orientation) and
// projects target bounding boxes, polygons, and visual marker pins accurately.
// ============================================================================

export type ObjectFitMode = 'contain' | 'cover' | 'fill';

export interface NormalizedPoint {
  x: number; // 0.0 to 1.0 relative to original image width
  y: number; // 0.0 to 1.0 relative to original image height
}

export interface NormalizedBoundingBox {
  x: number; // 0.0 to 1.0 left edge
  y: number; // 0.0 to 1.0 top edge
  width: number; // 0.0 to 1.0 width
  height: number; // 0.0 to 1.0 height
}

export interface RenderedImageViewportMetrics {
  containerWidth: number;
  containerHeight: number;
  intrinsicWidth: number;
  intrinsicHeight: number;
  objectFit: ObjectFitMode;
  /** Left offset of the visible rendered image content inside the container (px) */
  offsetX: number;
  /** Top offset of the visible rendered image content inside the container (px) */
  offsetY: number;
  /** Rendered width of the full image before any container clipping (px) */
  renderedWidth: number;
  /** Rendered height of the full image before any container clipping (px) */
  renderedHeight: number;
  /** Horizontal scale factor from intrinsic pixels to rendered pixels */
  scaleX: number;
  /** Vertical scale factor from intrinsic pixels to rendered pixels */
  scaleY: number;
}

export interface ProjectedTargetGeometry {
  targetId: string;
  targetNumber: number;
  /** Bounding box in container pixel coordinates */
  boxPx: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  /** Bounding box as percentages (0–100) relative to the rendered image overlay box */
  boxPercentOfRenderedImage: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  /** Visual marker pin center in container pixel coordinates */
  pinPx: {
    x: number;
    y: number;
  };
  /** Visual marker pin center as percentages (0–100) relative to the rendered image overlay box */
  pinPercentOfRenderedImage: {
    x: number;
    y: number;
  };
  /** Recommended touch target diameter in pixels (minimum 34px on mobile, 36px on desktop) */
  recommendedMarkerSizePx: number;
  /** Minimum interactive hit/touch target size in pixels (>=40px on mobile, >=36px on tablet/desktop) */
  touchTargetSizePx: number;
  /** Whether the marker pin was nudged slightly to avoid edge clipping or badge collision */
  wasCollisionAdjusted: boolean;
}

export interface ViewportSpec {
  id: string;
  label: string;
  deviceCategory: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait';
}

/**
 * Representative viewport test matrix required by Stage C & Stage I:
 * Desktop (1920x1080, 2560x1440), Laptop (1366x768),
 * iPads & Android Tablets (768x1024, 1024x768, 1024x1366, 1366x1024),
 * iPhones (390x844, 430x932), Android Phones (360x800).
 */
export const REPRESENTATIVE_VIEWPORT_MATRIX: ViewportSpec[] = [
  { id: 'android-phone', label: 'Android Phone 360×800', deviceCategory: 'mobile', width: 360, height: 800, orientation: 'portrait' },
  { id: 'iphone-14', label: 'iPhone 390×844', deviceCategory: 'mobile', width: 390, height: 844, orientation: 'portrait' },
  { id: 'iphone-16-pro-max', label: 'iPhone 16 Pro Max 430×932', deviceCategory: 'mobile', width: 430, height: 932, orientation: 'portrait' },
  { id: 'iphone-16-pro-max-landscape', label: 'iPhone 16 Pro Max Landscape 932×430', deviceCategory: 'mobile', width: 932, height: 430, orientation: 'landscape' },
  { id: 'tablet-portrait-768', label: 'iPad Portrait 768×1024', deviceCategory: 'tablet', width: 768, height: 1024, orientation: 'portrait' },
  { id: 'tablet-landscape-1024', label: 'iPad Landscape 1024×768', deviceCategory: 'tablet', width: 1024, height: 768, orientation: 'landscape' },
  { id: 'tablet-pro-portrait', label: 'iPad Pro Portrait 1024×1366', deviceCategory: 'tablet', width: 1024, height: 1366, orientation: 'portrait' },
  { id: 'tablet-pro-landscape', label: 'iPad Pro Landscape 1366×1024', deviceCategory: 'tablet', width: 1366, height: 1024, orientation: 'landscape' },
  { id: 'laptop-1366', label: 'Laptop 1366×768', deviceCategory: 'laptop', width: 1366, height: 768, orientation: 'landscape' },
  { id: 'laptop-1440', label: 'Laptop 1440×900', deviceCategory: 'laptop', width: 1440, height: 900, orientation: 'landscape' },
  { id: 'desktop-1080p', label: 'Desktop 1920×1080', deviceCategory: 'desktop', width: 1920, height: 1080, orientation: 'landscape' },
  { id: 'desktop-1440p', label: 'Desktop 2560×1440', deviceCategory: 'desktop', width: 2560, height: 1440, orientation: 'landscape' },
];


export function clampNormalized(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * Computes the exact rendered image rectangle inside a container given the container's
 * CSS box dimensions, the image's intrinsic dimensions, and the active `object-fit` mode.
 */
export function computeRenderedImageRect(params: {
  containerWidth: number;
  containerHeight: number;
  intrinsicWidth: number;
  intrinsicHeight: number;
  objectFit?: ObjectFitMode;
}): RenderedImageViewportMetrics {
  const containerWidth = Math.max(1, params.containerWidth);
  const containerHeight = Math.max(1, params.containerHeight);
  const intrinsicWidth = Math.max(1, params.intrinsicWidth || 1200);
  const intrinsicHeight = Math.max(1, params.intrinsicHeight || 900);
  const objectFit: ObjectFitMode = params.objectFit || 'contain';

  if (objectFit === 'fill') {
    return {
      containerWidth,
      containerHeight,
      intrinsicWidth,
      intrinsicHeight,
      objectFit,
      offsetX: 0,
      offsetY: 0,
      renderedWidth: containerWidth,
      renderedHeight: containerHeight,
      scaleX: containerWidth / intrinsicWidth,
      scaleY: containerHeight / intrinsicHeight,
    };
  }

  const containerAspect = containerWidth / containerHeight;
  const imageAspect = intrinsicWidth / intrinsicHeight;

  let renderedWidth = containerWidth;
  let renderedHeight = containerHeight;

  if (objectFit === 'contain') {
    if (containerAspect > imageAspect) {
      // Pillarbox (horizontal bars on left and right)
      renderedHeight = containerHeight;
      renderedWidth = containerHeight * imageAspect;
    } else {
      // Letterbox (vertical bars on top and bottom)
      renderedWidth = containerWidth;
      renderedHeight = containerWidth / imageAspect;
    }
  } else {
    // objectFit === 'cover'
    if (containerAspect > imageAspect) {
      renderedWidth = containerWidth;
      renderedHeight = containerWidth / imageAspect;
    } else {
      renderedHeight = containerHeight;
      renderedWidth = containerHeight * imageAspect;
    }
  }

  const offsetX = (containerWidth - renderedWidth) / 2;
  const offsetY = (containerHeight - renderedHeight) / 2;

  return {
    containerWidth,
    containerHeight,
    intrinsicWidth,
    intrinsicHeight,
    objectFit,
    offsetX,
    offsetY,
    renderedWidth,
    renderedHeight,
    scaleX: renderedWidth / intrinsicWidth,
    scaleY: renderedHeight / intrinsicHeight,
  };
}

/**
 * Resolves the canonical marker pin center for an object target.
 * Uses explicit `centerX`/`centerY` if provided and inside `[0, 1]`, otherwise
 * defaults to the geometric center of the normalized bounding box.
 */
export function resolveNormalizedMarkerCenter(target: {
  x: number;
  y: number;
  width: number;
  height: number;
  centerX?: number;
  centerY?: number;
}): NormalizedPoint {
  const boxCenterX = clampNormalized(target.x + target.width / 2);
  const boxCenterY = clampNormalized(target.y + target.height / 2);

  const cx =
    typeof target.centerX === 'number' && Number.isFinite(target.centerX)
      ? clampNormalized(target.centerX)
      : boxCenterX;
  const cy =
    typeof target.centerY === 'number' && Number.isFinite(target.centerY)
      ? clampNormalized(target.centerY)
      : boxCenterY;

  return { x: cx, y: cy };
}

/**
 * Projects a single target's normalized geometry onto the rendered image rect.
 */
export function projectNormalizedTargetToViewport(
  target: {
    id: string;
    targetNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
    centerX?: number;
    centerY?: number;
  },
  metrics: RenderedImageViewportMetrics,
  viewportWidth = metrics.containerWidth
): ProjectedTargetGeometry {
  const nx = clampNormalized(target.x);
  const ny = clampNormalized(target.y);
  const nw = Math.max(0.01, Math.min(1 - nx, target.width));
  const nh = Math.max(0.01, Math.min(1 - ny, target.height));
  const pinNorm = resolveNormalizedMarkerCenter(target);

  const boxLeftPx = metrics.offsetX + nx * metrics.renderedWidth;
  const boxTopPx = metrics.offsetY + ny * metrics.renderedHeight;
  const boxWidthPx = nw * metrics.renderedWidth;
  const boxHeightPx = nh * metrics.renderedHeight;

  const pinPxX = metrics.offsetX + pinNorm.x * metrics.renderedWidth;
  const pinPxY = metrics.offsetY + pinNorm.y * metrics.renderedHeight;

  const isCompactMobile = viewportWidth <= 480;
  const isTablet = viewportWidth > 480 && viewportWidth <= 1024;
  const recommendedMarkerSizePx = isCompactMobile ? 34 : isTablet ? 36 : 38;
  const touchTargetSizePx = isCompactMobile ? 42 : isTablet ? 38 : 36;

  return {
    targetId: target.id,
    targetNumber: target.targetNumber,
    boxPx: {
      left: Number(boxLeftPx.toFixed(6)),
      top: Number(boxTopPx.toFixed(6)),
      width: Number(boxWidthPx.toFixed(6)),
      height: Number(boxHeightPx.toFixed(6)),
    },
    boxPercentOfRenderedImage: {
      left: Number((nx * 100).toFixed(4)),
      top: Number((ny * 100).toFixed(4)),
      width: Number((nw * 100).toFixed(4)),
      height: Number((nh * 100).toFixed(4)),
    },
    pinPx: {
      x: Number(pinPxX.toFixed(6)),
      y: Number(pinPxY.toFixed(6)),
    },
    pinPercentOfRenderedImage: {
      x: Number((pinNorm.x * 100).toFixed(4)),
      y: Number((pinNorm.y * 100).toFixed(4)),
    },
    recommendedMarkerSizePx,
    touchTargetSizePx,
    wasCollisionAdjusted: false,
  };
}

/**
 * Projects all targets in a scene and applies a gentle collision-avoidance pass
 * when two marker pins would overlap on small screens, while keeping every marker
 * strictly inside its own object bounding box.
 */
export function projectAllSceneTargetsToViewport(
  targets: Array<{
    id: string;
    targetNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
    centerX?: number;
    centerY?: number;
  }>,
  metrics: RenderedImageViewportMetrics,
  viewportWidth = metrics.containerWidth
): ProjectedTargetGeometry[] {
  const projected = targets.map((t) =>
    projectNormalizedTargetToViewport(t, metrics, viewportWidth)
  );

  // Check pairwise marker badge distance on small viewports
  const minBadgeDistPx = projected[0]?.recommendedMarkerSizePx
    ? projected[0].recommendedMarkerSizePx * 0.92
    : 32;

  for (let i = 0; i < projected.length; i++) {
    for (let j = i + 1; j < projected.length; j++) {
      const a = projected[i];
      const b = projected[j];
      const dx = b.pinPx.x - a.pinPx.x;
      const dy = b.pinPx.y - a.pinPx.y;
      const dist = Math.hypot(dx, dy);

      if (dist < minBadgeDistPx) {
        const push = (minBadgeDistPx - dist) / 2 + 2;
        const angle = dist > 0.001 ? Math.atan2(dy, dx) : Math.PI / 4;
        const shiftX = Math.cos(angle) * push;
        const shiftY = Math.sin(angle) * push;

        // Clamp within each target's own bounding box so a marker never drifts off its object
        const clampInBox = (
          px: number,
          py: number,
          box: { left: number; top: number; width: number; height: number }
        ) => ({
          x: Math.max(box.left + 6, Math.min(box.left + box.width - 6, px)),
          y: Math.max(box.top + 6, Math.min(box.top + box.height - 6, py)),
        });

        const nextA = clampInBox(a.pinPx.x - shiftX, a.pinPx.y - shiftY, a.boxPx);
        const nextB = clampInBox(b.pinPx.x + shiftX, b.pinPx.y + shiftY, b.boxPx);

        a.pinPx = { x: Number(nextA.x.toFixed(2)), y: Number(nextA.y.toFixed(2)) };
        b.pinPx = { x: Number(nextB.x.toFixed(2)), y: Number(nextB.y.toFixed(2)) };

        a.pinPercentOfRenderedImage = {
          x: Number((((a.pinPx.x - metrics.offsetX) / metrics.renderedWidth) * 100).toFixed(3)),
          y: Number((((a.pinPx.y - metrics.offsetY) / metrics.renderedHeight) * 100).toFixed(3)),
        };
        b.pinPercentOfRenderedImage = {
          x: Number((((b.pinPx.x - metrics.offsetX) / metrics.renderedWidth) * 100).toFixed(3)),
          y: Number((((b.pinPx.y - metrics.offsetY) / metrics.renderedHeight) * 100).toFixed(3)),
        };

        a.wasCollisionAdjusted = true;
        b.wasCollisionAdjusted = true;
      }
    }
  }

  return projected;
}

/**
 * Converts a pointer click/drag event inside the container back into normalized
 * `[0.0, 1.0]` original-image coordinates.
 */
export function convertContainerPointToNormalizedImagePoint(
  clientOffsetX: number,
  clientOffsetY: number,
  metrics: RenderedImageViewportMetrics
): NormalizedPoint {
  const relX = (clientOffsetX - metrics.offsetX) / Math.max(1, metrics.renderedWidth);
  const relY = (clientOffsetY - metrics.offsetY) / Math.max(1, metrics.renderedHeight);
  return {
    x: Number(clampNormalized(relX).toFixed(4)),
    y: Number(clampNormalized(relY).toFixed(4)),
  };
}

/**
 * Point-in-polygon hit test using ray casting in normalized coordinates.
 */
export function isNormalizedPointInsidePolygon(
  point: NormalizedPoint,
  polygon: NormalizedPoint[]
): boolean {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi + 1e-12) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Determines which target in a scene is hit at a given normalized image coordinate.
 * Supports both `(point, targets)` and `(targets, x, y)` call conventions.
 */
export function resolveTargetHitAtNormalizedPoint<
  T extends {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    centerX?: number;
    centerY?: number;
    polygon?: NormalizedPoint[];
  }
>(
  first: NormalizedPoint | T[],
  second: T[] | number,
  third = 0.035
): T | null {
  let point: NormalizedPoint;
  let targets: T[];
  let pinHitRadiusNormalized = 0.035;

  if (Array.isArray(first)) {
    targets = first;
    point = { x: Number(second), y: Number(third) };
  } else {
    point = first;
    targets = second as T[];
    pinHitRadiusNormalized = third;
  }

  // 1. Check direct marker badge pin hit first
  let closestPinTarget: T | null = null;
  let closestPinDist = Infinity;

  for (const t of targets) {
    const center = resolveNormalizedMarkerCenter(t);
    const dist = Math.hypot(point.x - center.x, point.y - center.y);
    if (dist <= pinHitRadiusNormalized && dist < closestPinDist) {
      closestPinDist = dist;
      closestPinTarget = t;
    }
  }
  if (closestPinTarget) return closestPinTarget;

  // 2. Check polygon hit
  for (const t of targets) {
    if (t.polygon && t.polygon.length >= 3 && isNormalizedPointInsidePolygon(point, t.polygon)) {
      return t;
    }
  }

  // 3. Check bounding boxes (smallest area wins if nested)
  const matchingBoxes = targets.filter(
    (t) =>
      point.x >= t.x &&
      point.x <= t.x + t.width &&
      point.y >= t.y &&
      point.y <= t.y + t.height
  );

  if (matchingBoxes.length === 0) return null;
  matchingBoxes.sort((a, b) => a.width * a.height - b.width * b.height);
  return matchingBoxes[0];
}

/**
 * Computes Intersection-over-Union (IoU) between two normalized bounding boxes.
 */
export function computeBoundingBoxIoU(
  a: NormalizedBoundingBox,
  b: NormalizedBoundingBox
): number {
  const xLeft = Math.max(a.x, b.x);
  const yTop = Math.max(a.y, b.y);
  const xRight = Math.min(a.x + a.width, b.x + b.width);
  const yBottom = Math.min(a.y + a.height, b.y + b.height);

  if (xRight <= xLeft || yBottom <= yTop) return 0;

  const intersectionArea = (xRight - xLeft) * (yBottom - yTop);
  const areaA = Math.max(0, a.width * a.height);
  const areaB = Math.max(0, b.width * b.height);
  const unionArea = areaA + areaB - intersectionArea;

  if (unionArea <= 0) return 0;
  return intersectionArea / unionArea;
}

// ============================================================================
// ZOOM & PAN SYNCHRONIZATION ENGINE (Section 22)
// Ensures scene images and hotspot markers transform as a single unit with
// bounded panning and drag-vs-click disambiguation.
// ============================================================================

export interface IdentifyZoomPanState {
  scale: number; // 1.0 (fit) to 3.0 (max zoom)
  panX: number; // px translation relative to container width
  panY: number; // px translation relative to container height
}

export const DEFAULT_ZOOM_PAN_STATE: IdentifyZoomPanState = {
  scale: 1,
  panX: 0,
  panY: 0,
};

export function clampZoomPanState(
  state: IdentifyZoomPanState,
  containerWidth = 800,
  containerHeight = 600
): IdentifyZoomPanState {
  const scale = Number(Math.max(1, Math.min(3, state.scale || 1)).toFixed(3));
  if (scale <= 1.001) {
    return { scale: 1, panX: 0, panY: 0 };
  }
  const maxPanX = ((scale - 1) * containerWidth) / 2;
  const maxPanY = ((scale - 1) * containerHeight) / 2;
  const panX = Number(Math.max(-maxPanX, Math.min(maxPanX, state.panX || 0)).toFixed(2));
  const panY = Number(Math.max(-maxPanY, Math.min(maxPanY, state.panY || 0)).toFixed(2));
  return { scale, panX, panY };
}

/**
 * Projects a normalized target under an active Zoom & Pan state and verifies
 * that its relative normalized coordinates inside the transformed stage remain
 * 100% invariant (zero marker drift).
 */
export function projectTargetWithZoomPan(
  target: {
    id: string;
    targetNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
    centerX?: number;
    centerY?: number;
  },
  metrics: RenderedImageViewportMetrics,
  zoomPan: IdentifyZoomPanState
): ProjectedTargetGeometry & {
  transformedPinPx: { x: number; y: number };
  transformedBoxPx: { left: number; top: number; width: number; height: number };
} {
  const base = projectNormalizedTargetToViewport(target, metrics);
  const clamped = clampZoomPanState(zoomPan, metrics.containerWidth, metrics.containerHeight);
  const originX = metrics.containerWidth / 2;
  const originY = metrics.containerHeight / 2;

  const transformX = (x: number) =>
    Number((originX + (x - originX) * clamped.scale + clamped.panX).toFixed(4));
  const transformY = (y: number) =>
    Number((originY + (y - originY) * clamped.scale + clamped.panY).toFixed(4));

  return {
    ...base,
    transformedPinPx: {
      x: transformX(base.pinPx.x),
      y: transformY(base.pinPx.y),
    },
    transformedBoxPx: {
      left: transformX(base.boxPx.left),
      top: transformY(base.boxPx.top),
      width: Number((base.boxPx.width * clamped.scale).toFixed(4)),
      height: Number((base.boxPx.height * clamped.scale).toFixed(4)),
    },
  };
}

/**
 * Determines whether a pointer gesture was a pan drag (distance > thresholdPx)
 * so panning never accidentally triggers hotspot selection.
 */
export function isPointerGesturePanDrag(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  thresholdPx = 6
): boolean {
  return Math.hypot(endX - startX, endY - startY) > thresholdPx;
}

