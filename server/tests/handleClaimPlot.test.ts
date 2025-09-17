import { Request, Response } from "express";
import { handleClaimPlot } from "../controllers/handleClaimPlot";
import { Visitor } from "../utils/index.js";

// Mock the Visitor module
jest.mock("../utils/index.js", () => ({
  Visitor: {
    get: jest.fn(),
  },
  getCredentials: jest.fn().mockImplementation((query) => query),
}));

describe("handleClaimPlot", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const jsonMock = jest.fn();
  const statusMock = jest.fn().mockReturnThis();
  const mockVisitor = {
    fetchDataObject: jest.fn(),
    dataObject: null as any,
    setDataObject: jest.fn(),
    updateDataObject: jest.fn(),
  };

  beforeEach(() => {
    mockRequest = {
      query: {
        profileId: "test-profile-id",
        displayName: "Test User",
        urlSlug: "test-world",
        visitorId: "test-visitor-id",
        assetId: "test-asset-id",
        sceneDropId: "test-scene-drop-id",
        interactiveNonce: "test-nonce",
        interactivePublicKey: "test-public-key",
      },
      body: {
        plotId: 3, // Example plot ID
      },
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };

    jsonMock.mockClear();
    statusMock.mockClear();

    // Reset visitor mock implementation
    mockVisitor.fetchDataObject.mockResolvedValue(undefined);
    mockVisitor.dataObject = null;
    mockVisitor.setDataObject.mockResolvedValue(undefined);
    mockVisitor.updateDataObject.mockResolvedValue(undefined);

    // Mock Visitor.get to return our mock visitor
    (Visitor.get as jest.Mock).mockResolvedValue(mockVisitor);
  });

  it("should return 400 if plotId is missing", async () => {
    mockRequest.body = {}; // No plotId

    await handleClaimPlot(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: "Missing plotId in request body",
    });
  });

  it("should initialize data object if it does not exist", async () => {
    await handleClaimPlot(mockRequest as Request, mockResponse as Response);

    // Should have called setDataObject with default data
    expect(mockVisitor.setDataObject).toHaveBeenCalled();
    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: { plotId: 3 },
    });
  });

  it("should update existing data object if it exists", async () => {
    // Set up existing data object
    mockVisitor.dataObject = {
      coinsAvailable: 10,
      totalCoinsEarned: 0,
      availablePlots: { 0: true, 1: true, 2: true, 3: true },
      seedsPurchased: {},
      plants: {},
    };

    await handleClaimPlot(mockRequest as Request, mockResponse as Response);

    // Should have called updateDataObject with updated availablePlots
    expect(mockVisitor.updateDataObject).toHaveBeenCalled();
    expect(mockVisitor.updateDataObject.mock.calls[0][0]).toHaveProperty("availablePlots");
    expect(mockVisitor.updateDataObject.mock.calls[0][0].availablePlots[3]).toBe(false);

    expect(jsonMock).toHaveBeenCalledWith({
      success: true,
      data: { plotId: 3 },
    });
  });

  it("should return 400 if plot is already claimed", async () => {
    // Set up existing data object with plot 3 already claimed
    mockVisitor.dataObject = {
      coinsAvailable: 10,
      totalCoinsEarned: 0,
      availablePlots: { 0: true, 1: true, 2: true, 3: false },
      seedsPurchased: {},
      plants: {},
    };

    await handleClaimPlot(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      success: false,
      error: "Plot is already claimed",
    });
  });
});
