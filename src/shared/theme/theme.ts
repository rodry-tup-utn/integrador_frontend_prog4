import { createTheme, type MantineColorsTuple } from "@mantine/core";
const teal: MantineColorsTuple = [
  "#e6fcf5",
  "#c3fae8",
  "#96f2d7",
  "#63e6be",
  "#38d9a9",
  "#20c997",
  "#12b886",
  "#0ca678",
  "#099268",
  "#087f5b",
];
const orange: MantineColorsTuple = [
  "#fff4e6",
  "#ffe8cc",
  "#ffd8a8",
  "#ffc078",
  "#ffa94d",
  "#ff922b",
  "#fd7e14",
  "#f76707",
  "#e8590c",
  "#d9480f",
];
export const theme = createTheme({
  primaryColor: "teal",
  colors: { teal, orange },
  fontFamily: "Inter, system-ui, sans-serif",
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        size: "sm",
      },
    },
  },
});
