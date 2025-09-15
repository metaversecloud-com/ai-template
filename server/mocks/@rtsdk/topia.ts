export const fireToast = jest.fn().mockResolvedValue({ success: true });
export const triggerParticle = jest.fn().mockResolvedValue({ success: true });
export const create = jest.fn().mockReturnValue({ id: "asset-123" });
export const drop = jest.fn().mockResolvedValue({
  id: "dropped-123",
  assetId: "asset-123",
  position: { x: 500, y: 500 },
  assetName: "Plant",
  uniqueName: "plant-test",
});
export const get = jest.fn().mockResolvedValue({
  id: "visitor-123",
  dataObject: { droppedPlants: [] },
  fetchDataObject: jest.fn().mockResolvedValue({ success: true }),
  setDataObject: jest.fn().mockResolvedValue({ success: true }),
  updateDataObject: jest.fn().mockResolvedValue({ success: true }),
});

export class Topia {
  constructor(_opts: any) {}
}

export class AssetFactory {
  constructor(_topia: any) {}
  create(assetIdOrUrl: string, opts: any) {
    (__mock as any).lastAssetCreateArgs = { assetIdOrUrl, opts };
    return { id: "asset-123" };
  }
}

export class DroppedAssetFactory {
  constructor(_topia: any) {}
  drop(asset: any, opts: any) {
    (__mock as any).lastDroppedAssetArgs = { asset, opts };
    return drop(asset, opts);
  }
}

export class UserFactory {
  constructor(_topia: any) {}
}

export class VisitorFactory {
  constructor(_topia: any) {}
  get(visitorId: number, urlSlug: string, opts: any) {
    (__mock as any).lastVisitorGetArgs = { visitorId, urlSlug, opts };
    return get(visitorId, urlSlug, opts);
  }
}

export class WorldFactory {
  constructor(_topia: any) {}
  create(slug: string, opts: any) {
    (__mock as any).lastWorldCreateArgs = { slug, opts };
    return {
      fireToast,
      triggerParticle,
    };
  }
}

export interface DroppedAssetInterface {
  id: string;
  assetId?: string;
  assetName?: string;
  position?: { x: number; y: number };
  uniqueName?: string;
  bottomLayerURL?: string;
  topLayerURL?: string;
}

export interface VisitorInterface {
  id: string;
  isAdmin?: boolean;
  x?: number;
  y?: number;
}

export const __mock = {
  fireToast,
  triggerParticle,
  create,
  drop,
  get,
  lastWorldCreateArgs: null as any,
  lastAssetCreateArgs: null as any,
  lastDroppedAssetArgs: null as any,
  lastVisitorGetArgs: null as any,
  reset() {
    fireToast.mockClear();
    triggerParticle.mockClear();
    create.mockClear();
    drop.mockClear();
    get.mockClear();
    this.lastWorldCreateArgs = null;
    this.lastAssetCreateArgs = null;
    this.lastDroppedAssetArgs = null;
    this.lastVisitorGetArgs = null;
  },
};
