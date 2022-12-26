import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { wrap } from "popmotion";
import { ReviewsList } from "./ReviewsList";
import "./Reviews.scss";

const variants = {
  enter: (direction) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

export default function Reviews() {
  const [[page, direction], setPage] = useState([0, 0]);
  const dataIndex = wrap(0, ReviewsList.length, page);

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <section className="reviewsSection">
      <h3 className="title">Testimonials</h3>

      <div className="reviewsSlider">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
          >
            <div className="reviewWrap">
              <div className="reviewList">
                <p className="text">"{ReviewsList[dataIndex].review}"</p>
                <p
                  className="boldText"
                  style={{
                    textAlign: "right",
                  }}
                >
                  - {ReviewsList[dataIndex].reviewersName},{" "}
                  {ReviewsList[dataIndex].reviewersCountry}.
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="next" onClick={() => paginate(1)}>
          <FiChevronRight size={24} stroke="white" />
        </div>
        <div className="prev" onClick={() => paginate(-1)}>
          <FiChevronLeft size={24} stroke="white" />
        </div>
      </div>
    </section>
  );
}
