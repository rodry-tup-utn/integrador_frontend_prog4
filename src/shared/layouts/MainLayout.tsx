import { Outlet, useNavigate } from "react-router-dom";
import { AppShell, Container, Overlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Header from "../../widgets/header/Header";
import Sidebar from "../../widgets/sidebar/Sidebar";
import { useAuth } from "../../features/auth/context/AuthContext";
import { useEffect, useRef } from "react";
const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const navigate = useNavigate();
  const prevAuth = useRef(isAuthenticated);

  useEffect(() => {
    if (prevAuth.current && !isAuthenticated) {
      navigate("/", { replace: true });
    }
    prevAuth.current = isAuthenticated;
  }, [isAuthenticated, navigate]);
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
