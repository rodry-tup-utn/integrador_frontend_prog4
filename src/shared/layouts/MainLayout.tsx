import { Outlet } from "react-router-dom";
import { AppShell, Container, Overlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "../../widgets/header/Header";
import Sidebar from "../../widgets/sidebar/Sidebar";
import { useAuth } from "../../features/auth/context/AuthContext";
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 250,
        breakpoint: "sm",
        collapsed: {
          desktop: !isAuthenticated || !desktopOpened,
          mobile: !mobileOpened,
        },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Header
          toggle={toggleMobile}
          toggleDesktop={toggleDesktop}
          desktopOpened={desktopOpened}
          mobileOpened={mobileOpened}
        />
      </AppShell.Header>
      {isAuthenticated && (
        <AppShell.Navbar p="xs">
          <Sidebar onMobileClose={toggleMobile} />
        </AppShell.Navbar>
      )}
      {isAuthenticated && mobileOpened && (
        <Overlay
          onClick={toggleMobile}
          opacity={0}
          color="white"
          zIndex={100}
          hiddenFrom="sm"
        />
      )}
      <AppShell.Main bg="gray.0">
        <Container size="xl" py="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};
export default MainLayout;
