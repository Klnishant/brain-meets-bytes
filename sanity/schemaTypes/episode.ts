import { defineField, defineType } from "sanity";

export const episode = defineType({
  name: "episode",
  title: "Episode",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Episode Type",
      type: "string",
      options: {
        list: [
          { title: "Audio", value: "audio" },
          { title: "Video", value: "video" },
        ],
        layout: "radio",
      },
      initialValue: "audio",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "podcast",
      title: "Podcast",
      type: "reference",
      to: [{ type: "podcast" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Published date",
      type: "datetime",
    }),
    defineField({
      name: "image",
      title: "Episode Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "mediaFile",
      title: "Audio / Video File",
      type: "file",
      options: {
        storeOriginalFilename: true,
      },
      description:
        "Upload the primary audio or video file for this episode. Use the Episode Type field above to indicate whether this is audio or video.",
    }),
    defineField({
      name: "duration",
      title: "Duration (minutes)",
      type: "number",
    }),
  ],
});
