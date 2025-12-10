import { defineField, defineType } from "sanity";

export const aboutKi = defineType({
  name: "aboutKi",
  title: "About Ki",
  type: "document",
  fields: [
    defineField({
      name: "badgeLabel",
      title: "Badge label",
      type: "string",
      initialValue: "About Ki",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
      initialValue: "Hi, I’m Ki, CO-founder of brain meets bytes",
    }),
    defineField({
      name: "body",
      title: "Body text",
      type: "text",
      rows: 8,
    }),
    defineField({
      name: "ctaLabel",
      title: "Button label",
      type: "string",
      initialValue: "Learn More",
    }),
    defineField({
      name: "image",
      title: "Portrait image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
});
