import { Title } from "@solidjs/meta";
import { onMount, onCleanup, createSignal } from "solid-js";

export default function MetaTitle(props: { title: string }) {
  const [displayTitle, setDisplayTitle] = createSignal(props.title);
const messages = [
    "I miss you :c",
    "Come back!",
    "Helllooooo!?",
    "Don't leave me...",
    "Lonely... :c",
    "I'm still here!",
    "Where'd you go? :3",
    "Don't forget me!",
    "Is it someone else? >:(",
    "Missing you already!",
    "Don't be gone long!",
    "Did I do something?",
    "Checking other tabs?",
    "I'm still here! :/"
  ];

  onMount(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setDisplayTitle(randomMsg);
      } else {
        setDisplayTitle(props.title);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    
    onCleanup(() => {
      document.removeEventListener("visibilitychange", handleVisibility);
    });
  });

  return <Title>{displayTitle()}</Title>;
}