import { component$, Slot } from '@builder.io/qwik';
import Nav from '../components/nav';

export default component$(() => {
  return (
    <>
      <Nav />
      <div class="h-20" />
      <Slot />
    </>
  );
});
