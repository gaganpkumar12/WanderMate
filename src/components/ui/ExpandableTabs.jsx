import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnClickOutside } from "usehooks-ts";
import { useLocation, useNavigate } from "react-router-dom";
import "./expandable-tabs.css";

function ExpandableTabs({ tabs }) {
  const [selected, setSelected] = useState(null);
  const outsideRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useOnClickOutside(outsideRef, () => {
    setSelected(null);
  });

  // Sync active tab with current route
  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname === tab.href);
    setSelected(activeTab || null);
  }, [location.pathname, tabs]);

  const handleTabClick = (tab) => {
    setSelected(tab);
    navigate(tab.href);
  };

  return (
    <div className="expandable-tabs-wrapper" ref={outsideRef}>
      <div className="expandable-tabs">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = selected?.title === tab.title;
          return (
            <motion.button
              key={tab.title}
              className={`expandable-tab${isActive ? " active" : ""}`}
              onClick={() => handleTabClick(tab)}
              layout
              transition={{ duration: 0.3, type: "spring", bounce: 0.15 }}
            >
              <span className="expandable-tab-icon">
                <Icon size={18} />
              </span>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    className="expandable-tab-label"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, type: "spring", bounce: 0.15 }}
                  >
                    {tab.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default ExpandableTabs;
