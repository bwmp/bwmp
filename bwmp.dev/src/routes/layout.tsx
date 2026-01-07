import { $, component$, Slot, useOnDocument, useSignal } from '@builder.io/qwik';
import Nav from '../components/nav';

export default component$(() => {
  const PadForNav = useSignal(false);

  useOnDocument('load', $(() => {
    if (window.location.pathname != '/') {
      PadForNav.value = true;
    }
  }));

  return (
    <>
      <Nav />
      {PadForNav.value && <div class="h-20" />}
      <Slot />
    </>
  );
});
