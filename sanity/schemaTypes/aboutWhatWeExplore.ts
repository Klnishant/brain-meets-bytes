import { defineField, defineType } from "sanity";

export const aboutWhatWeExplore = defineType({
  name: "aboutWhatWeExplore",
  title: "About - What We Explore",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      initialValue: "What We Explore",
    }),
    defineField({
      name: "items",
      title: "Tiles",
      type: "array",
      of: [
        defineField({
          name: "tile",
          title: "Tile",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "accentColor",
              title: "Accent color",
              type: "string",
              description: "Hex color for the tile heading (e.g. #2E58FF)",
            }),
            defineField({
              name: "icon",
              title: "Icon image",
              type: "image",
              options: { hotspot: true },
            }),
          ],
        }),
      ],
    }),
  ],
});
