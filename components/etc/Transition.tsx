import { AnimatePresence, m } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";

const Transition = ({ children }: React.PropsWithChildren) => {
  const { asPath } = useRouter();

  const variants = {
    out: {
      opacity: 0,
      y: 100,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        // delay: 0.2,
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };
  return (
    <div
    //  style={{ overflow: "hidden" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={asPath}
          variants={variants}
          animate="in"
          initial="out"
          exit="out"
        >
          {children}
        </m.div>
      </AnimatePresence>
    </div>
  );
};

export default Transition;
