import { defineField, defineType } from "sanity";

export const aboutApproach = defineType({
  name: "aboutApproach",
  title: "About Approach",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Right-side heading",
      type: "string",
      initialValue: "Science First. Human Always.",
    }),
    defineField({
      name: "body",
      title: "Right-side body",
      type: "text",
      rows: 4,
      initialValue:
        "And we’re just getting started. Join us as we uncover new knowledge, challenge assumptions, and explore what’s truly possible for the future of human health.",
    }),
    defineField({
      name: "points",
      title: "Approach points",
      type: "array",
      of: [
        defineField({
          name: "point",
          title: "Point",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "string",
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
