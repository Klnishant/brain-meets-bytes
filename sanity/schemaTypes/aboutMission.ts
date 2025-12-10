import { defineField, defineType } from "sanity";

export const aboutMission = defineType({
  name: "aboutMission",
  title: "About Mission",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Our Mission",
    }),
    defineField({
      name: "body",
      title: "Body text",
      type: "array",
      of: [{ type: "text" }],
      description: "Mission paragraphs (each item is a paragraph).",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      initialValue: "Learn More",
    }),
    defineField({
      name: "image",
      title: "Mission image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
