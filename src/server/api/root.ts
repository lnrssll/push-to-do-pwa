import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { Client } from "@notionhq/client";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  push: publicProcedure
    .input(
      z.object({
        token: z.string().min(50).max(50),
        page: z.string().min(36).max(36),
        text: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const notion = new Client({ auth: input.token });
      try {
        // if (!input.page) {
        //   const response = await notion.pages.create({
        //     parent: {
        //       database_id: "c7e9d8e8-0d1b-4e5e-9e8d-5b5d9b9f5c5a",
        //     },
        //     properties: {
        //       title: {
        //         type: "title",
        //         title: [
        //           {
        //             type: "text",
        //             text: {
        //               content: "Next up",
        //             },
        //           },
        //         ],
        //       },
        //     },
        //   });
        //   console.log(response);
        //   pageId = response.id;
        // }
        return await notion.blocks.children.append({
          block_id: input.page,
          children: [
            {
              object: "block",
              type: "to_do",
              to_do: {
                checked: false,
                rich_text: [
                  {
                    type: "text",
                    text: {
                      content: input.text,
                    },
                  },
                ],
              },
            },
          ],
        });
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to push to Notion",
        });
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
