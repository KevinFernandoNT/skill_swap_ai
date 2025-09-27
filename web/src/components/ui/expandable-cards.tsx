import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export function ExpandableCards() {
  const [active, setActive] = useState<(typeof users)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void) => {
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          callback();
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, callback]);
  };

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="w-full h-full flex flex-col bg-card rounded-lg p-6 border border-border">
      <div className="mb-6">
        <h3 className="font-bold text-white mb-1 text-lg">Suggested Users</h3>
        <p className="text-gray-400 text-sm">Connect with skill partners</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 h-full w-full z-10"
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {active && typeof active === "object" ? (
            <div className="fixed inset-0 grid place-items-center z-[100]">
              <motion.button
                key={`button-${active.name}-${id}`}
                layout
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.05,
                  },
                }}
                className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
                onClick={() => setActive(null)}
              >
                <CloseIcon />
              </motion.button>
              <motion.div
                layoutId={`card-${active.name}-${id}`}
                ref={ref}
                className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-card dark:bg-neutral-900 sm:rounded-3xl overflow-hidden border border-border"
              >
                <motion.div layoutId={`image-${active.name}-${id}`}>
                  <img
                    width={200}
                    height={200}
                    src={active.avatar}
                    alt={active.name}
                    className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                  />
                </motion.div>

                <div>
                  <div className="flex justify-between items-start p-4">
                    <div className="">
                      <motion.h3
                        layoutId={`title-${active.name}-${id}`}
                        className="font-bold text-foreground"
                      >
                        {active.name}
                      </motion.h3>
                      <motion.p
                        layoutId={`description-${active.email}-${id}`}
                        className="text-muted-foreground"
                      >
                        {active.email}
                      </motion.p>
                    </div>

                    <motion.button
                      layoutId={`button-${active.name}-${id}`}
                      className="px-4 py-3 text-sm rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      {active.ctaText}
                    </motion.button>
                  </div>
                  <div className="pt-4 relative px-4">
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-muted-foreground text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                    >
                      {typeof active.content === "function"
                        ? active.content()
                        : active.content}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
        
        <div className="space-y-3">
          {users.slice(0, 3).map((user, index) => (
            <motion.div
              layoutId={`card-${user.name}-${id}`}
              key={`card-${user.name}-${id}`}
              onClick={() => setActive(user)}
              className="p-3 flex items-center gap-3 hover:bg-muted/50 rounded-xl cursor-pointer border border-border/50 transition-colors"
            >
              <motion.div layoutId={`image-${user.name}-${id}`}>
                <img
                  width={40}
                  height={40}
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h3
                  layoutId={`title-${user.name}-${id}`}
                  className="font-medium text-white text-sm truncate"
                >
                  {user.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${user.email}-${id}`}
                  className="text-gray-400 text-xs truncate"
                >
                  {user.email}
                </motion.p>
              </div>
              <motion.button
                layoutId={`button-${user.name}-${id}`}
                className="px-3 py-1 text-xs rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {user.ctaText}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const users = [
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    ctaText: "Connect",
    content: () => {
      return (
        <div className="space-y-3">
          <p>
            Sarah is a passionate web developer with expertise in React and Node.js. 
            She loves creating user-friendly applications and is always eager to learn new technologies.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">React</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Node.js</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">TypeScript</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">MongoDB</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    ctaText: "Connect",
    content: () => {
      return (
        <div className="space-y-3">
          <p>
            Michael is a data scientist specializing in machine learning and Python. 
            He has experience in building predictive models and enjoys sharing knowledge with others.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Python</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">TensorFlow</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Pandas</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Scikit-learn</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    name: "Emily Rodriguez",
    email: "emily.rodriguez@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    ctaText: "Connect",
    content: () => {
      return (
        <div className="space-y-3">
          <p>
            Emily is a UI/UX designer with a keen eye for creating beautiful and functional interfaces. 
            She specializes in Figma and user research methodologies.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Figma</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Adobe XD</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">User Research</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Prototyping</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    name: "David Kim",
    email: "david.kim@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    ctaText: "Connect",
    content: () => {
      return (
        <div className="space-y-3">
          <p>
            David is a mobile app developer with expertise in React Native and iOS development. 
            He loves creating smooth, native-like mobile experiences.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">React Native</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">iOS</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Swift</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Firebase</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    name: "Lisa Wang",
    email: "lisa.wang@example.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    ctaText: "Connect",
    content: () => {
      return (
        <div className="space-y-3">
          <p>
            Lisa is a DevOps engineer passionate about automation and cloud infrastructure. 
            She specializes in AWS, Docker, and CI/CD pipelines.
          </p>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Skills:</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">AWS</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Docker</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Kubernetes</span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">Jenkins</span>
            </div>
          </div>
        </div>
      );
    },
  },
];
