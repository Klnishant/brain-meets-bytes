// Sanity schema entrypoint – register all document types here.

import { podcast } from "./podcast";
import { episode } from "./episode";
import { article } from "./article";
import { aboutKi } from "./aboutKi";
import { aboutRebecca } from "./aboutRebecca";
import { aboutHero } from "./aboutHero";
import { aboutMission } from "./aboutMission";
import { aboutWhatWeExplore } from "./aboutWhatWeExplore";
import { aboutApproach } from "./aboutApproach";
import { podcastHero } from "./podcastHero";
import { forumHero } from "./forumHero";
import { homeHero } from "./homeHero";
import { homeForum } from "./homeForum";
import { aboutForum } from "./aboutForum";
import { footer } from "./footer";

export const schemaTypes = [
  podcast,
  episode,
  article,
  aboutKi,
  aboutRebecca,
  aboutHero,
  aboutMission,
  aboutWhatWeExplore,
  aboutApproach,
  podcastHero,
  forumHero,
  homeHero,
  homeForum,
  aboutForum,
  footer,
];
