// "Borrowed" from github.com/Nerimity/nerimity-web/
import styles from "./Skeleton.module.scss";
import { For, JSX, onCleanup, onMount } from "solid-js";

const SkeletonList = (props: {
  count?: number;
  children: JSX.Element;
  style?: JSX.CSSProperties;
  class?: string;
}) => {
  return (
    <div 
      class={`${styles.skeletonList} ${props.class || ''}`} 
      style={props.style}
    >
      <For each={Array(props.count ?? 30).fill(undefined)}>
        {() => props.children}
      </For>
    </div>
  );
};

const SkeletonItem = (props: {
  width?: string;
  height?: string;
  style?: JSX.CSSProperties;
  onInView?: () => void;
  class?: string;
}) => {
  let element: HTMLDivElement | undefined;

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    if (entries[0].isIntersecting) {
      props.onInView?.();
    }
  };

  onMount(() => {
    if (props.onInView && element) {
      const observer = new IntersectionObserver(handleIntersection);
      observer.observe(element);

      onCleanup(() => {
        observer.disconnect();
      });
    }
  });

  const style = () => ({
    ...(props.height ? { height: props.height } : {}),
    ...(props.width ? { width: props.width } : {}),
    ...props.style,
  });

  return (
    <div
      ref={element}
      style={style()}
      class={`${styles.skeletonItem} ${props.class || ''}`}
    />
  );
};

export const Skeleton = {
  List: SkeletonList,
  Item: SkeletonItem,
};