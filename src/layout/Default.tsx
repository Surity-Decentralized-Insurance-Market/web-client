import { Outlet } from "react-router-dom";
import SideNav from "../common/SideNav";
import Modal from "../common/Modal";
import { useRef } from "react";
import useIdleScrollbar from "../hooks/useIdleScrollbar";
import StatisticsSidebar from "../common/StatisticsSidebar";
import Header from "../common/Header";

export default function Default() {
  const mainSectionRef = useRef() as React.MutableRefObject<HTMLDivElement>;

  useIdleScrollbar(mainSectionRef);

  return (
    <>
      <Modal />

      <main className="flex h-screen">
        <SideNav />
        <section
          ref={mainSectionRef}
          className="h-screen overflow-y-scroll scrollbar-primary flex-1"
        >
          <Header />
          <Outlet />
        </section>
        <StatisticsSidebar />
      </main>
    </>
  );
}
