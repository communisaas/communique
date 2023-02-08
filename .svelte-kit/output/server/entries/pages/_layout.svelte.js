import { c as create_ssr_component, b as subscribe, e as each, d as add_attribute, v as validate_component, m as missing_component } from "../../chunks/index.js";
import { p as page } from "../../chunks/stores.js";
const app = "";
const Home_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "svg.svelte-1jh0svc{filter:drop-shadow(2px 2px 1px rgb(0 0 0 / 0.4));transition:0.2s filter ease-out}svg.svelte-1jh0svc:hover{filter:drop-shadow(4px 4px 3px rgb(0 0 0 / 0.4));transition:0.2s filter ease-in}",
  map: null
};
const Home = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<icon class="${"cursor-pointer"}" title="${"Home"}"><svg width="${"100%"}" viewBox="${"0 0 32 26"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-1jh0svc"}"><path d="${"M22.4165 17L29.7308 25H2.26925L9.58353 17H22.4165Z"}" stroke="${"#D7FEF0"}" stroke-width="${"2"}"></path><path d="${"M8.9251 13.1774L8.90713 13.1679L8.88879 13.1592L2.0719 9.92161L15.9527 1.17999L29.9531 9.90291L15.962 16.8766L8.9251 13.1774Z"}" stroke="${"#D7FEF0"}" stroke-width="${"2"}"></path><path d="${"M1.00002 23.9211L11.201 15.7714L1.00016 11.5025L1.00002 23.9211Z"}" stroke="${"#D7FEF0"}" stroke-width="${"2"}"></path><path d="${"M31 23.9211L20.799 15.7714L30.9998 11.5025L31 23.9211Z"}" stroke="${"#D7FEF0"}" stroke-width="${"2"}"></path></svg>
</icon>`;
});
const Compose_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "svg.svelte-1jh0svc{filter:drop-shadow(2px 2px 1px rgb(0 0 0 / 0.4));transition:0.2s filter ease-out}svg.svelte-1jh0svc:hover{filter:drop-shadow(4px 4px 3px rgb(0 0 0 / 0.4));transition:0.2s filter ease-in}",
  map: null
};
const Compose = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<icon class="${"cursor-pointer"}" title="${"Compose"}"><svg width="${"100%"}" viewBox="${"0 0 32 28"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-1jh0svc"}"><line y1="${"26.5"}" x2="${"2.03739"}" y2="${"26.5"}" stroke="${"#D7FEF0"}" stroke-width="${"3"}"></line><line x1="${"3.05608"}" y1="${"26.5"}" x2="${"8.14954"}" y2="${"26.5"}" stroke="${"#D7FEF0"}" stroke-width="${"3"}"></line><line x1="${"9.16823"}" y1="${"26.5"}" x2="${"13.243"}" y2="${"26.5"}" stroke="${"#D7FEF0"}" stroke-width="${"3"}"></line><path d="${"M30.3151 5.61351L30.3031 5.60809C31.1405 3.5054 30.3505 1.18691 28.446 0.326038C26.4477 -0.577283 23.9688 0.461228 22.9202 2.64104L14.2953 20.5709L15.2571 27.7438L21.5436 23.8475L29.4371 7.43801C30.0518 7.71587 30.2898 8.48771 29.9672 9.15822L26.6027 16.1527L28.2753 16.9088L31.6399 9.91432C32.4465 8.23768 31.8522 6.30834 30.3151 5.61351ZM27.5683 2.1506C28.5497 2.59421 28.9817 3.7567 28.6219 4.84815L24.7595 3.10222C25.3907 2.13345 26.587 1.70702 27.5683 2.1506ZM16.7672 24.6046L16.3529 21.5154L19.4747 22.9265L16.7672 24.6046ZM20.743 21.2785L16.84 19.5143L19.9119 13.1282L23.8149 14.8925L20.743 21.2785ZM24.6926 13.0679L20.7896 11.3036L23.8615 4.91765L27.7644 6.68191L24.6926 13.0679Z"}" fill="${"#D7FEF0"}"></path></svg>
</icon>`;
});
const Navigation_svelte_svelte_type_style_lang = "";
const css = {
  code: "a.svelte-mzua01{width:100%;padding:1.5rem 0.5rem;opacity:100%;transition:all 0.2s ease-in}.active.svelte-mzua01{transition:all 0.2s ease-out;filter:contrast(0.4);border-radius:1%}",
  map: null
};
const Navigation = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const navLinks = { "/": Home, "/compose": Compose };
  $$result.css.add(css);
  $$unsubscribe_page();
  return `<aside class="${"object-cover inline-flex h-full"}"><div class="${"flex flex-col items-center h-full bg-peacockFeather-500 shadow-nav z-50"}"><nav class="${"flex flex-col"}">${each(Object.entries(navLinks), ([route, icon]) => {
    return `<a${add_attribute("href", route, 0)} class="${[
      "svelte-mzua01",
      ($page.route.id == `${route}` ? "pointer-events-none" : "") + " " + ($page.route.id == route ? "active" : "")
    ].join(" ").trim()}">${validate_component(icon || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</a>`;
  })}</nav></div>
</aside>`;
});
const styles = "";
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="${"app"}"><main class="${"flex min-h-screen overflow-y-scroll"}"><div class="${"grow-0 shrink-0 w-20"}">${validate_component(Navigation, "Navigation").$$render($$result, {}, {}, {})}</div>

		<div class="${"grow"}"><header class="${"block py-[1.25rem]"}"><h1 class="${""}">Loudest emails in</h1></header>
			${slots.default ? slots.default({}) : ``}</div></main>

	<footer></footer></div>`;
});
export {
  Layout as default
};
