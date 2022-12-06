import { ArrayIterator, Iterator } from "../iterator/iterator.js";

export { FocusRing }

const emptyIterator =
  Iterator(undefined, _ => undefined, _ => true);

const FocusRing = nonEmptyIterator => FocusRingInternal(
  emptyIterator,
  nonEmptyIterator.copy() // paranoid
);

const FocusRingInternal = (pre, post) => {
  const focus = () => post.head();

  const right = () => {
    const currentFocus = post.head();
    const modifiedPost = post.copy().drop(1);

    if (modifiedPost.eq$(emptyIterator)) {
      if (pre.eq$(emptyIterator)) {
        // do nothing when only one element in list
        return FocusRingInternal(pre, post);
      }
      return FocusRingInternal(
        ArrayIterator([currentFocus]),
        pre.reverse$()
      );
    }
    const modifiedPre = pre.copy().cons$(currentFocus); // paranoid 2
    return FocusRingInternal(modifiedPre, modifiedPost);
  };

  const left = () => {
    let modifiedPre = pre.copy();
    let modifiedPost = post.copy();
    if (modifiedPre.isEmpty()) {
      modifiedPre = post.copy().reverse$();
      modifiedPost = ArrayIterator([]);
      // if post had only one element
      if (modifiedPre.isEmpty()) return FocusRingInternal(pre, post);
    }

    const headPre       = modifiedPre.head();
    modifiedPost        = modifiedPost.copy().cons$(headPre);
    return FocusRingInternal(modifiedPre.drop(1), modifiedPost);
  };

  return { focus, left, right }
};