import { defineField, defineType } from "sanity";

export const aboutRebecca = defineType({
  name: "aboutRebecca",
  title: "About Rebecca",
  type: "document",
  fields: [
    defineField({
      name: "badgeLabel",
      title: "Badge label",
      type: "string",
      initialValue: "About Rebecca",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
      initialValue:
        "Hi, I’m REBECCA, CO-founder of brain meets bytes AND A MASTERS EDUCATED FORENSIC NURSE",
    }),
    defineField({
      name: "body",
      title: "Body text",
      type: "text",
      rows: 10,
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
