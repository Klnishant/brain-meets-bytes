import { defineField, defineType } from "sanity";

export const aboutHero = defineType({
  name: "aboutHero",
  title: "About Hero",
  type: "document",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
      initialValue: "Where Brain Science Meets a Healthier Future for Everyone",
    }),
    defineField({
      name: "highlightText",
      title: "Highlight Text",
      type: "string",
      description: "Part of the heading shown in red (e.g. 'Healthier Future')",
      initialValue: "Healthier Future",
    }),
    defineField({
      name: "body",
      title: "Body text",
      type: "text",
      rows: 4,
      initialValue:
        "Brain Meets Bytes explores breakthroughs in neuroscience, healthy aging, and human longevity—translating emerging science into insights that help us all live longer, healthier, and sharper lives.",
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary CTA label",
      type: "string",
      initialValue: "Watch Latest Episode",
    }),
  ],
});
