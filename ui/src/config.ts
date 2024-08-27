export type ConfigProps = {
  sidebarDrawer: boolean;
  customizerDrawer: boolean;
  miniSidebar: boolean;
  horizontalLayout: boolean;
  dark: boolean;
};

const config: ConfigProps = {
  sidebarDrawer: true,
  customizerDrawer: false,
  miniSidebar: false,
  horizontalLayout: false, // Horizontal layout
  dark: false,
}

export default config
