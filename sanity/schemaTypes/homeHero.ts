import { defineField, defineType } from "sanity";

export const homeHero = defineType({
  name: "homeHero",
  title: "Home Hero",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Exploring the Breakthroughs Advancing Brain Health & Longevity.",
    }),
    defineField({
        name: "description",
        title: "Description",
        type: "string",
        initialValue: "Conversations with the world’s leading experts in brain health and human longevity distilled into insights you can trust.",
    }),
    defineField({
      name: "tag",
      title: "Tag",
      type: "string",
      initialValue: "Cutting-edge Brain Science & Longevity"
    }),
  ],
});