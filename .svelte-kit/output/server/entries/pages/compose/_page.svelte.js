import { c as create_ssr_component, f as escape, h as null_to_empty, e as each, d as add_attribute, i as createEventDispatcher, o as onDestroy, v as validate_component } from "../../../chunks/index.js";
const Tag_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: "input.svelte-1rksek2{opacity:0;transition:opacity 0.25s, width 0.25s}.delete.svelte-1rksek2{opacity:0;transform:scale(0);transition:opacity 0.25s, transform 0.25s, visibility 0s 0.25s}.delete.svelte-1rksek2::before{content:'\\D7';color:#fff;font-size:1rem;line-height:1rem;opacity:95%;text-shadow:rgba(0, 0, 0, 0.25) 0px 2px 2px}.show.svelte-1rksek2{visibility:visible;opacity:1}input.show.svelte-1rksek2{width:5rem;transition:opacity 0.25s, width 0.25s}.delete.show.svelte-1rksek2{transform:scale(1);transition:opacity 0.25s, transform 0.25s, visibility 0s 0.25s}",
  map: null
};
const Tag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type, name, style, tagStyle } = $$props;
  let { tagList = [] } = $$props;
  let inputField;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  if ($$props.tagStyle === void 0 && $$bindings.tagStyle && tagStyle !== void 0)
    $$bindings.tagStyle(tagStyle);
  if ($$props.tagList === void 0 && $$bindings.tagList && tagList !== void 0)
    $$bindings.tagList(tagList);
  $$result.css.add(css$4);
  return `<form class="${escape(null_to_empty(style), true) + " svelte-1rksek2"}"><ul class="${"max-w-fit px-3 py-1 h-full flex flex-row place-items-center justify-center flex-wrap gap-2 rounded bg-larimarGreen-600 shadow-artistBlue shadow-card"}">${each(tagList, (tag) => {
    return `<li class="${"relative text-xs " + escape(tagStyle, true) + " group svelte-1rksek2"}"><button type="${"button"}" class="${[
      "delete absolute -top-1 -left-2 rounded-full bg-amber-600 w-4 h-4 svelte-1rksek2",
      ""
    ].join(" ").trim()}"></button>
				${escape(tag)}
			</li>`;
  })}

		<li class="${"flex flex-row place-items-center"}"><input${add_attribute("name", name, 0)} role="${"textbox"}"${add_attribute("placeholder", name, 0)}${add_attribute("inputmode", type, 0)} class="${[
    "space-x-2 rounded h-full bg-larimarGreen-500 shadow-artistBlue shadow-card w-0 svelte-1rksek2",
    ""
  ].join(" ").trim()}"${add_attribute("type", type, 0)}${add_attribute("this", inputField, 0)}>
			<button type="${"submit"}" class="${"flex justify-center items-center relative"}">${slots.default ? slots.default({}) : ``}</button></li></ul>
</form>`;
});
const Line = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { type, name, style } = $$props;
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  if ($$props.style === void 0 && $$bindings.style && style !== void 0)
    $$bindings.style(style);
  return `<form class="${"flex flex-col h-fit w-fit"}"><span class="${"px-1 py-1 rounded bg-larimarGreen-600 shadow-artistBlue shadow-card"}"><input${add_attribute("name", name, 0)}${add_attribute("placeholder", name, 0)} class="${escape(style, true) + " rounded"}"${add_attribute("type", type, 0)}></span></form>`;
});
const uuid = (prefix) => {
  return prefix + "_" + Math.floor(Math.random() * 1e9) + String(Date.now());
};
const Editor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { id = uuid("tinymce-svelte") } = $$props;
  let { inline = void 0 } = $$props;
  let { disabled = false } = $$props;
  let { apiKey = "no-api-key" } = $$props;
  let { channel = "6" } = $$props;
  let { scriptSrc = void 0 } = $$props;
  let { conf = {} } = $$props;
  let { modelEvents = "change input undo redo" } = $$props;
  let { value = "" } = $$props;
  let { text = "" } = $$props;
  let { cssClass = "tinymce-wrapper" } = $$props;
  let container;
  let element;
  createEventDispatcher();
  onDestroy(() => {
  });
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.inline === void 0 && $$bindings.inline && inline !== void 0)
    $$bindings.inline(inline);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.apiKey === void 0 && $$bindings.apiKey && apiKey !== void 0)
    $$bindings.apiKey(apiKey);
  if ($$props.channel === void 0 && $$bindings.channel && channel !== void 0)
    $$bindings.channel(channel);
  if ($$props.scriptSrc === void 0 && $$bindings.scriptSrc && scriptSrc !== void 0)
    $$bindings.scriptSrc(scriptSrc);
  if ($$props.conf === void 0 && $$bindings.conf && conf !== void 0)
    $$bindings.conf(conf);
  if ($$props.modelEvents === void 0 && $$bindings.modelEvents && modelEvents !== void 0)
    $$bindings.modelEvents(modelEvents);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0)
    $$bindings.value(value);
  if ($$props.text === void 0 && $$bindings.text && text !== void 0)
    $$bindings.text(text);
  if ($$props.cssClass === void 0 && $$bindings.cssClass && cssClass !== void 0)
    $$bindings.cssClass(cssClass);
  return `<div${add_attribute("class", cssClass, 0)}${add_attribute("this", container, 0)}>${inline ? `<div${add_attribute("id", id, 0)}${add_attribute("this", element, 0)}></div>` : `<textarea${add_attribute("id", id, 0)} style="${"visibility:hidden"}"${add_attribute("this", element, 0)}></textarea>`}</div>`;
});
const Editor_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".tox-editor-header{box-shadow:rgba(0, 0, 0, 0.16) 0px 2px 4px !important;transition:box-shadow 0.2s ease-out}.tox-editor-header:hover{box-shadow:rgba(0, 0, 0, 0.16) 0px 4px 10px !important;transition:box-shadow 0.2s ease-in}.tinymce-wrapper{padding-top:1rem}.mce-content-body{min-height:10rem;min-width:55vw}",
  map: null
};
const Editor_1 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { apiKey } = $$props;
  let inputData;
  const conf = {
    placeholder: "Write me a letter...",
    menubar: false,
    contextmenu: "blocks | forecolor backcolor | link copy cut paste",
    toolbar: [
      {
        name: "formatting",
        items: ["bold", "italic", "underline"]
      },
      { name: "font", items: ["fontfamily"] },
      {
        name: "color",
        items: ["forecolor", "backcolor"]
      },
      {
        name: "alignment",
        items: ["alignleft", "aligncenter", "alignright", "alignjustify"]
      },
      {
        name: "media",
        items: ["link", "numlist", "bullist", "table", "image"]
      }
    ],
    toolbar_persist: true,
    toolbar_mode: "sliding",
    fixed_toolbar_container: "#toolbar",
    statusbar: true,
    plugins: "quickbars image table editimage autolink link lists",
    quickbars_insert_toolbar: false,
    quickbars_selection_toolbar: "forecolor backcolor | h1 h2 h3 | link  ",
    link_default_target: "_blank",
    init_instance_callback: (editor) => {
      editor.on("keypress", () => {
        inputData = editor.getContent();
        console.log(inputData);
      });
    }
  };
  if ($$props.apiKey === void 0 && $$bindings.apiKey && apiKey !== void 0)
    $$bindings.apiKey(apiKey);
  $$result.css.add(css$3);
  return `<main class="${"relative flex flex-col items-center bg-paper px-40 py-5 min-h-[10vh]"}"><span id="${"toolbar"}" class="${"-mt-12"}"></span>
	${validate_component(Editor, "Editor").$$render($$result, { apiKey, conf, inline: true }, {}, {})}
</main>`;
});
const Recipient_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "svg.svelte-16w5f31{filter:drop-shadow(1px 1px 1px rgb(0 0 0 / 0.4));transition:0.2s filter ease-out}svg.svelte-16w5f31:hover{filter:drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4));transition:0.2s filter ease-in}",
  map: null
};
const Recipient = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<icon class="${"cursor-pointer"}" title="${"Add recipient"}"><svg width="${"100%"}" viewBox="${"0 0 32 32"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-16w5f31"}"><g filter="${"url(#filter0_d_40_6)"}"><path d="${"M10.9082 18.6953H24.0961L22.6307 29.9637H12.3735L10.9082 18.6953Z"}" fill="${"#D9D9D9"}"></path></g><path d="${"M22.3692 8.63421C22.3692 11.304 20.109 13.5184 17.2579 13.5184C14.4068 13.5184 12.1466 11.304 12.1466 8.63421C12.1466 5.96439 14.4068 3.75 17.2579 3.75C20.109 3.75 22.3692 5.96439 22.3692 8.63421Z"}" stroke="${"#D7FEF0"}" stroke-width="${"1.5"}"></path><path d="${"M26.7825 22.7197L25.5132 20.2795C24.929 19.1563 23.8475 18.376 22.5973 18.1757L21.2649 17.9622C20.5709 17.851 19.9408 17.4921 19.4912 16.9519V16.9519C18.3295 15.556 16.1863 15.556 15.0246 16.9519V16.9519C14.575 17.4921 13.9449 17.851 13.2509 17.9622L11.9185 18.1757C10.6683 18.376 9.58684 19.1563 9.0026 20.2795L7.73331 22.7197"}" stroke="${"#D7FEF0"}" stroke-width="${"1.5"}"></path><path d="${"M9.07029 25.7139C11.8754 26.8273 13.822 27.6811 12.4568 28.0117C11.4048 28.0117 5.52955 27.0828 6.0302 25.1486C6.46417 23.4719 9.58896 16.4805 9.41947 20.9861C8.55406 23.0688 7.05149 24.9126 9.07029 25.7139Z"}" fill="${"#D7FEF0"}"></path><defs><filter id="${"filter0_d_40_6"}" x="${"9.90818"}" y="${"18.6953"}" width="${"15.1879"}" height="${"13.2684"}" filterUnits="${"userSpaceOnUse"}" color-interpolation-filters="${"sRGB"}"><feFlood flood-opacity="${"0"}" result="${"BackgroundImageFix"}"></feFlood><feColorMatrix in="${"SourceAlpha"}" type="${"matrix"}" values="${"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"}" result="${"hardAlpha"}"></feColorMatrix><feOffset dy="${"1"}"></feOffset><feGaussianBlur stdDeviation="${"0.5"}"></feGaussianBlur><feComposite in2="${"hardAlpha"}" operator="${"out"}"></feComposite><feColorMatrix type="${"matrix"}" values="${"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"}"></feColorMatrix><feBlend mode="${"normal"}" in2="${"BackgroundImageFix"}" result="${"effect1_dropShadow_40_6"}"></feBlend><feBlend mode="${"normal"}" in="${"SourceGraphic"}" in2="${"effect1_dropShadow_40_6"}" result="${"shape"}"></feBlend></filter></defs></svg>
</icon>`;
});
const Topic_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "svg.svelte-1rdh7kt{filter:drop-shadow(2px 2px 1px rgb(0 0 0 / 0.4));transition:0.2s filter ease-out}svg.svelte-1rdh7kt:hover{filter:drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4));transition:0.2s filter ease-in}",
  map: null
};
const Topic = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<icon class="${"cursor-pointer"}" title="${"Add topic"}"><svg width="${"100%"}" viewBox="${"0 0 32 32"}" fill="${"none"}" xmlns="${"http://www.w3.org/2000/svg"}" class="${"svelte-1rdh7kt"}"><line x1="${"7.07696"}" y1="${"7.99014"}" x2="${"8.81762"}" y2="${"7.99014"}" stroke="${"#D7FEF0"}" stroke-width="${"3"}"></line><line x1="${"14.7693"}" y1="${"7.99014"}" x2="${"19.121"}" y2="${"7.99014"}" stroke="${"#D7FEF0"}" stroke-width="${"3"}"></line><line x1="${"10.1539"}" y1="${"7.99014"}" x2="${"13.6352"}" y2="${"7.99014"}" stroke="${"#D7FEF0"}" stroke-width="${"3"}"></line><path d="${"M20.4037 16.5414H4.75V4.75H14.2523H23.7546V13.6516V19.1713L20.8913 16.7215L20.6807 16.5414H20.4037Z"}" stroke="${"#D7FEF0"}" stroke-width="${"1.5"}"></path><path d="${"M11.9139 22.7508H27.5676V10.9594H18.0653H8.56297V19.861V25.3807L11.4263 22.9309L11.6368 22.7508H11.9139Z"}" stroke="${"#D7FEF0"}" stroke-width="${"1.5"}"></path></svg>
</icon>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".add.svelte-qxhkpj.svelte-qxhkpj{position:absolute;color:#fff;font-size:1.5rem;line-height:1.5rem;opacity:75%;filter:drop-shadow(0 rgb(0 0 0 / 0.4));transform:scale(0.75);transition:all 0.2s ease-in}span.svelte-qxhkpj:hover>.add.svelte-qxhkpj{opacity:85%;filter:drop-shadow(3px 3px 2px rgb(0 0 0 / 0.4));transform:scale(0.85);transition:all 0.2s ease-out}.gradient-background.svelte-qxhkpj.svelte-qxhkpj{background:linear-gradient(\n			90deg,\n			#0A9396,\n			#94D2BD\n		)}",
  map: null
};
const addIconStyle = 'add after:content-["+"] -bottom-0.5 -right-1 rounded-full bg-peacockFeather-600 h-6 w-6';
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let recipientEmails;
  let topics;
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    recipientEmails = [];
    topics = [];
    {
      console.log(recipientEmails);
    }
    $$rendered = `<section class="${"gradient-background py-8 svelte-qxhkpj"}"><form class="${"flex flex-col gap-y-5"}"><div class="${"ml-20 flex flex-col w-fit h-full gap-x-20 gap-y-3"}"><span class="${"flex flex-row gap-x-5"}">${validate_component(Tag, "TagInput").$$render(
      $$result,
      {
        type: "email",
        name: "Recipient",
        style: "h-14 w-fit",
        tagStyle: "px-1 py-1 rounded bg-larimarGreen-500",
        tagList: recipientEmails
      },
      {
        tagList: ($$value) => {
          recipientEmails = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<span class="${"relative w-12 shadow-artistBlue svelte-qxhkpj"}">${validate_component(Recipient, "AddRecipient").$$render($$result, {}, {}, {})}
						<icon class="${escape(null_to_empty(addIconStyle), true) + " svelte-qxhkpj"}"></icon></span>`;
        }
      }
    )}
				${validate_component(Tag, "TagInput").$$render(
      $$result,
      {
        type: "text",
        name: "Topic",
        style: "w-fit h-14",
        tagStyle: "px-1 py-1 rounded bg-larimarGreen-500",
        tagList: topics
      },
      {
        tagList: ($$value) => {
          topics = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `<span class="${"relative w-12 shadow-artistBlue svelte-qxhkpj"}">${validate_component(Topic, "AddTopic").$$render($$result, {}, {}, {})}
						<icon class="${escape(null_to_empty(addIconStyle), true) + " svelte-qxhkpj"}"></icon></span>`;
        }
      }
    )}</span>

			${validate_component(Line, "LineInput").$$render(
      $$result,
      {
        type: "text",
        name: "Subject",
        style: "w-fit h-fit"
      },
      {},
      {}
    )}
			<aside class="${"inline-block w-fit"}"><p>Placeholders</p>
				<div class="${"px-1 py-2 h-10 w-full rounded bg-larimarGreen-600 shadow-artistBlue shadow-card"}"></div></aside></div>

		<span class="${"py-8"}">${validate_component(Editor_1, "Editor").$$render($$result, { apiKey: data.key }, {}, {})}</span>
		<button class="${"ml-20 px-1 py-2 w-28 rounded bg-larimarGreen-600"}" type="${"submit"}">Post</button></form>
</section>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};
