import { MdHome, MdAlbum, MdPerson, MdLibraryMusic } from "react-icons/md";

export const genres = [
  { title: "All", value: "ALL" },
  { title: "Pop", value: "POP" },
  { title: "Hip-Hop", value: "HIP_HOP_RAP" },
  { title: "Dance", value: "DANCE" },
  { title: "Electronic", value: "ELECTRONIC" },
  { title: "Soul", value: "SOUL_RNB" },
  { title: "Alternative", value: "ALTERNATIVE" },
  { title: "Rock", value: "ROCK" },
  { title: "Latin", value: "LATIN" },
  { title: "Film", value: "FILM_TV" },
  { title: "Country", value: "COUNTRY" },
  { title: "Worldwide", value: "WORLDWIDE" },
  { title: "Reggae", value: "REGGAE_DANCE_HALL" },
  { title: "House", value: "HOUSE" },
  { title: "K-Pop", value: "K_POP" },
];

export const links = [
  { name: "Discover", to: "/", icon: MdHome },
  { name: "Top Albums", to: "/top-albums", icon: MdAlbum },
  { name: "Top Artists", to: "/top-artists", icon: MdPerson },
  { name: "Top Playlists", to: "/top-playlists", icon: MdLibraryMusic },
];
