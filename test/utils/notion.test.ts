import NotionService from "../../src/utils/notion";
import l from "../../src/utils/logger";
import { Client } from "@notionhq/client";

jest.mock("@notionhq/client");
jest.mock("../../src/utils/logger");

describe("NotionService", () => {
  let notionService: NotionService;
  let notionClient: any;

  beforeEach(() => {
    (Client as unknown as jest.Mock).mockClear();
    notionService = new NotionService();
    notionClient = { pages: { create: jest.fn() } };

    notionService.notionClient = notionClient;

    process.env.NODE_ENV = "test";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    it('should create a Notion client with the provided token and log "Connected"', () => {
      new NotionService();

      expect(Client).toHaveBeenCalledWith({
        auth: process.env.NOTION_TOKEN,
      });
      expect(l.info).toHaveBeenCalledWith("Connected.", "notion");
    });

    it("should log an error message if connection fails", () => {
      const error = new Error("Connection error.");

      (Client as unknown as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      new NotionService();

      expect(l.error).toHaveBeenCalledWith(
        `Connection error.\n${error}`,
        "notion",
      );
    });
  });

  describe("jukephoneContact", () => {
    it("should create a Notion page with the given contact data", async () => {
      (notionService.notionClient.pages.create as jest.Mock).mockResolvedValue({
        id: "123",
        status: "success",
      });

      const contactData = {
        email: "test@example.com",
        name: "John Doe",
        role: "Developer",
        message: "Hello, Notion!",
      };

      const result = await notionService.jukephoneContact(contactData);

      expect(notionService.notionClient.pages.create).toHaveBeenCalledTimes(1);
      expect(notionService.notionClient.pages.create).toHaveBeenCalledWith({
        parent: {
          type: "database_id",
          database_id: "5bfdee65394d417c81723c9da39429ce",
        },
        properties: {
          Nom: {
            title: [
              {
                text: {
                  content: contactData.name,
                },
              },
            ],
          },
          Email: {
            email: contactData.email,
          },
          Rôle: {
            select: {
              name: contactData.role,
            },
          },
          Status: {
            select: {
              name: "Nouveau",
            },
          },
        },
        children: [
          {
            object: "block",
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: "Message",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: contactData.message,
                  },
                },
              ],
              color: "default",
            },
          },
        ],
      });
      expect(result).toEqual({ id: "123", status: "success" });
    });

    it("should create a Notion page with the given contact data", async () => {
      process.env.NODE_ENV = "development";

      (notionService.notionClient.pages.create as jest.Mock).mockResolvedValue({
        id: "123",
        status: "success",
      });

      const contactData = {
        email: "test@example.com",
        name: "John Doe",
        role: "Developer",
        message: "Hello, Notion!",
      };

      const result = await notionService.jukephoneContact(contactData);

      expect(notionService.notionClient.pages.create).toHaveBeenCalledTimes(1);
      expect(notionService.notionClient.pages.create).toHaveBeenCalledWith({
        parent: {
          type: "database_id",
          database_id: "5bfdee65394d417c81723c9da39429ce",
        },
        properties: {
          Nom: {
            title: [
              {
                text: {
                  content: contactData.name,
                },
              },
            ],
          },
          Email: {
            email: contactData.email,
          },
          Rôle: {
            select: {
              name: contactData.role,
            },
          },
          Status: {
            select: {
              name: "Dev",
            },
          },
        },
        children: [
          {
            object: "block",
            heading_2: {
              rich_text: [
                {
                  text: {
                    content: "Message",
                  },
                },
              ],
            },
          },
          {
            object: "block",
            paragraph: {
              rich_text: [
                {
                  text: {
                    content: contactData.message,
                  },
                },
              ],
              color: "default",
            },
          },
        ],
      });
      expect(result).toEqual({ id: "123", status: "success" });
    });

    it("should throw an error if Notion page creation fails", async () => {
      const error = new Error("Failed to create Notion page");
      (notionService.notionClient.pages.create as jest.Mock).mockRejectedValue(
        error,
      );

      const contactData = {
        email: "test@example.com",
        name: "John Doe",
        role: "Developer",
        message: "Hello, Notion!",
      };

      await expect(notionService.jukephoneContact(contactData)).rejects.toThrow(
        error,
      );
    });
  });
});
