
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\CharInput.svelte generated by Svelte v3.44.3 */

    const file$3 = "src\\CharInput.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[5] = list;
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (20:32) 
    function create_if_block_1$1(ctx) {
    	let span;
    	let span_name_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "non-letter svelte-71ydpk");
    			attr_dev(span, "name", span_name_value = /*letter*/ ctx[4]);
    			add_location(span, file$3, 20, 12, 551);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*pattern*/ 2 && span_name_value !== (span_name_value = /*letter*/ ctx[4])) {
    				attr_dev(span, "name", span_name_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(20:32) ",
    		ctx
    	});

    	return block;
    }

    // (18:8) {#if letter !==" "}
    function create_if_block$2(ctx) {
    	let input;
    	let input_name_value;
    	let mounted;
    	let dispose;

    	function input_input_handler() {
    		/*input_input_handler*/ ctx[3].call(input, /*letter*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "class", "letter svelte-71ydpk");
    			attr_dev(input, "name", input_name_value = /*letter*/ ctx[4]);
    			attr_dev(input, "maxlength", "2");
    			add_location(input, file$3, 18, 12, 403);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			set_input_value(input, /*sltn_key*/ ctx[0][/*letter*/ ctx[4]]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*fixInput*/ ctx[2], false, false, false),
    					listen_dev(input, "input", input_input_handler)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*pattern*/ 2 && input_name_value !== (input_name_value = /*letter*/ ctx[4])) {
    				attr_dev(input, "name", input_name_value);
    			}

    			if (dirty & /*sltn_key, pattern*/ 3 && input.value !== /*sltn_key*/ ctx[0][/*letter*/ ctx[4]]) {
    				set_input_value(input, /*sltn_key*/ ctx[0][/*letter*/ ctx[4]]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(18:8) {#if letter !==\\\" \\\"}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {#each pattern as letter}
    function create_each_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*letter*/ ctx[4] !== " ") return create_if_block$2;
    		if (/*letter*/ ctx[4] === " ") return create_if_block_1$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(17:4) {#each pattern as letter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let each_value = /*pattern*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "input-row svelte-71ydpk");
    			add_location(div, file$3, 15, 0, 304);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*pattern, sltn_key, fixInput*/ 7) {
    				each_value = /*pattern*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CharInput', slots, []);
    	let { pattern = [] } = $$props;
    	let { sltn_key } = $$props;

    	function fixInput(e) {
    		let letter = e.target.value;
    		letter = letter.trim();
    		letter = letter.toUpperCase();

    		if (sltn_key[letter] == undefined) {
    			letter = " ";
    		}

    		e.target.value = letter;
    	}

    	const writable_props = ['pattern', 'sltn_key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<CharInput> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler(letter) {
    		sltn_key[letter] = this.value;
    		$$invalidate(0, sltn_key);
    		$$invalidate(1, pattern);
    	}

    	$$self.$$set = $$props => {
    		if ('pattern' in $$props) $$invalidate(1, pattern = $$props.pattern);
    		if ('sltn_key' in $$props) $$invalidate(0, sltn_key = $$props.sltn_key);
    	};

    	$$self.$capture_state = () => ({ pattern, sltn_key, fixInput });

    	$$self.$inject_state = $$props => {
    		if ('pattern' in $$props) $$invalidate(1, pattern = $$props.pattern);
    		if ('sltn_key' in $$props) $$invalidate(0, sltn_key = $$props.sltn_key);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sltn_key, pattern, fixInput, input_input_handler];
    }

    class CharInput extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { pattern: 1, sltn_key: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CharInput",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sltn_key*/ ctx[0] === undefined && !('sltn_key' in props)) {
    			console.warn("<CharInput> was created without expected prop 'sltn_key'");
    		}
    	}

    	get pattern() {
    		throw new Error("<CharInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pattern(value) {
    		throw new Error("<CharInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sltn_key() {
    		throw new Error("<CharInput>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sltn_key(value) {
    		throw new Error("<CharInput>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Quote.svelte generated by Svelte v3.44.3 */
    const file$2 = "src\\Quote.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[19] = i;
    	return child_ctx;
    }

    // (89:25) 
    function create_if_block_1(ctx) {
    	let h2;
    	let t_value = /*line*/ ctx[17] + "";
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(t_value);
    			attr_dev(h2, "class", "svelte-ifi6ih");
    			add_location(h2, file$2, 89, 12, 2535);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*inputWrapped*/ 4 && t_value !== (t_value = /*line*/ ctx[17] + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(89:25) ",
    		ctx
    	});

    	return block;
    }

    // (87:8) {#if i%2==0}
    function create_if_block$1(ctx) {
    	let charinput;
    	let updating_sltn_key;
    	let current;

    	function charinput_sltn_key_binding(value) {
    		/*charinput_sltn_key_binding*/ ctx[7](value);
    	}

    	let charinput_props = { pattern: /*line*/ ctx[17] };

    	if (/*sltn_key*/ ctx[0] !== void 0) {
    		charinput_props.sltn_key = /*sltn_key*/ ctx[0];
    	}

    	charinput = new CharInput({ props: charinput_props, $$inline: true });
    	binding_callbacks.push(() => bind(charinput, 'sltn_key', charinput_sltn_key_binding));

    	const block = {
    		c: function create() {
    			create_component(charinput.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(charinput, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const charinput_changes = {};
    			if (dirty & /*inputWrapped*/ 4) charinput_changes.pattern = /*line*/ ctx[17];

    			if (!updating_sltn_key && dirty & /*sltn_key*/ 1) {
    				updating_sltn_key = true;
    				charinput_changes.sltn_key = /*sltn_key*/ ctx[0];
    				add_flush_callback(() => updating_sltn_key = false);
    			}

    			charinput.$set(charinput_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(charinput.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(charinput.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(charinput, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(87:8) {#if i%2==0}",
    		ctx
    	});

    	return block;
    }

    // (86:4) {#each inputWrapped as line, i}
    function create_each_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*i*/ ctx[19] % 2 == 0) return 0;
    		if (/*i*/ ctx[19] % 2 != 0) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (if_block) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(86:4) {#each inputWrapped as line, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let t0;
    	let p;
    	let t1;
    	let t2;
    	let current;
    	let each_value = /*inputWrapped*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			p = element("p");
    			t1 = text("- ");
    			t2 = text(/*author*/ ctx[1]);
    			attr_dev(p, "class", "svelte-ifi6ih");
    			add_location(p, file$2, 92, 4, 2584);
    			attr_dev(div, "class", "quote-group svelte-ifi6ih");
    			add_location(div, file$2, 84, 0, 2353);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputWrapped, sltn_key*/ 5) {
    				each_value = /*inputWrapped*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*author*/ 2) set_data_dev(t2, /*author*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function buildMap(array, Map) {
    	const length = array.length;

    	for (let i = 0; i < length; i++) {
    		let letter = array[i];
    		Map.set(letter, i);
    	}

    	return Map;
    }

    function shuffle(input) {
    	let currentIndex = input.length, randomIndex;

    	while (currentIndex != 0) {
    		randomIndex = Math.floor(Math.random() * currentIndex);
    		currentIndex--;
    		[input[currentIndex], input[randomIndex]] = [input[randomIndex], input[currentIndex]];
    	}

    	return input;
    }

    function wrap(string, width) {
    	let wrapped = string.replace(new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g'), '$1\n');
    	wrapped = wrapped.split("\n");
    	return wrapped;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let AlphabetMap;
    	let encryptedQuote;
    	let wrappedQuote;
    	let inputWrapped;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Quote', slots, []);
    	let { quote } = $$props;
    	let { author } = $$props;
    	let { width = 25 } = $$props;
    	let { sltn_key } = $$props;
    	const ALPHABET = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    	let Alphabet = ALPHABET;
    	let AlphabetM = new Map();

    	function isAlpha(letter) {
    		return AlphabetMap.get(letter) !== undefined;
    	}

    	function inputWrapper(wrappedQuote) {
    		let output = [];

    		wrappedQuote.forEach(element => {
    			output.push(inputLetterMap(element));
    			output.push(element);
    		});

    		return output;
    	}

    	function mappedLetter(letter) {
    		return isAlpha(letter)
    		? Alphabet[AlphabetMap.get(letter)]
    		: letter;
    	}

    	function encodeSentence(input) {
    		let output = input.toUpperCase();
    		output = [...output];
    		output = output.map(x => mappedLetter(x));
    		output = output.join("");
    		return output;
    	}

    	function inputLetterMap(input) {
    		let output = [...input];

    		output = output.map(x => {
    			return isAlpha(x) ? x : " ";
    		});

    		output = output.join("");
    		return output;
    	}

    	onMount(() => {
    		shuffle(Alphabet);
    	});

    	const writable_props = ['quote', 'author', 'width', 'sltn_key'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Quote> was created with unknown prop '${key}'`);
    	});

    	function charinput_sltn_key_binding(value) {
    		sltn_key = value;
    		$$invalidate(0, sltn_key);
    	}

    	$$self.$$set = $$props => {
    		if ('quote' in $$props) $$invalidate(3, quote = $$props.quote);
    		if ('author' in $$props) $$invalidate(1, author = $$props.author);
    		if ('width' in $$props) $$invalidate(4, width = $$props.width);
    		if ('sltn_key' in $$props) $$invalidate(0, sltn_key = $$props.sltn_key);
    	};

    	$$self.$capture_state = () => ({
    		CharInput,
    		quote,
    		author,
    		width,
    		sltn_key,
    		ALPHABET,
    		Alphabet,
    		AlphabetM,
    		isAlpha,
    		inputWrapper,
    		buildMap,
    		shuffle,
    		mappedLetter,
    		encodeSentence,
    		inputLetterMap,
    		wrap,
    		onMount,
    		AlphabetMap,
    		wrappedQuote,
    		inputWrapped,
    		encryptedQuote
    	});

    	$$self.$inject_state = $$props => {
    		if ('quote' in $$props) $$invalidate(3, quote = $$props.quote);
    		if ('author' in $$props) $$invalidate(1, author = $$props.author);
    		if ('width' in $$props) $$invalidate(4, width = $$props.width);
    		if ('sltn_key' in $$props) $$invalidate(0, sltn_key = $$props.sltn_key);
    		if ('Alphabet' in $$props) Alphabet = $$props.Alphabet;
    		if ('AlphabetM' in $$props) $$invalidate(11, AlphabetM = $$props.AlphabetM);
    		if ('AlphabetMap' in $$props) AlphabetMap = $$props.AlphabetMap;
    		if ('wrappedQuote' in $$props) $$invalidate(5, wrappedQuote = $$props.wrappedQuote);
    		if ('inputWrapped' in $$props) $$invalidate(2, inputWrapped = $$props.inputWrapped);
    		if ('encryptedQuote' in $$props) $$invalidate(6, encryptedQuote = $$props.encryptedQuote);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*quote*/ 8) {
    			$$invalidate(6, encryptedQuote = encodeSentence(quote));
    		}

    		if ($$self.$$.dirty & /*encryptedQuote, width*/ 80) {
    			$$invalidate(5, wrappedQuote = wrap(encryptedQuote, width));
    		}

    		if ($$self.$$.dirty & /*wrappedQuote*/ 32) {
    			$$invalidate(2, inputWrapped = inputWrapper(wrappedQuote));
    		}
    	};

    	AlphabetMap = buildMap(ALPHABET, AlphabetM);

    	return [
    		sltn_key,
    		author,
    		inputWrapped,
    		quote,
    		width,
    		wrappedQuote,
    		encryptedQuote,
    		charinput_sltn_key_binding
    	];
    }

    class Quote extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			quote: 3,
    			author: 1,
    			width: 4,
    			sltn_key: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Quote",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*quote*/ ctx[3] === undefined && !('quote' in props)) {
    			console.warn("<Quote> was created without expected prop 'quote'");
    		}

    		if (/*author*/ ctx[1] === undefined && !('author' in props)) {
    			console.warn("<Quote> was created without expected prop 'author'");
    		}

    		if (/*sltn_key*/ ctx[0] === undefined && !('sltn_key' in props)) {
    			console.warn("<Quote> was created without expected prop 'sltn_key'");
    		}
    	}

    	get quote() {
    		throw new Error("<Quote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set quote(value) {
    		throw new Error("<Quote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get author() {
    		throw new Error("<Quote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set author(value) {
    		throw new Error("<Quote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Quote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Quote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sltn_key() {
    		throw new Error("<Quote>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sltn_key(value) {
    		throw new Error("<Quote>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\ButtonGroup.svelte generated by Svelte v3.44.3 */
    const file$1 = "src\\ButtonGroup.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	child_ctx[7] = i;
    	return child_ctx;
    }

    // (26:0) {#if options.length > 1}
    function create_if_block(ctx) {
    	let div;
    	let each_value = /*options*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "buttons svelte-srnxl");
    			add_location(div, file$1, 26, 4, 592);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options, name, btnCls, value, setSelected*/ 15) {
    				each_value = /*options*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(26:0) {#if options.length > 1}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#each options as option, i}
    function create_each_block(ctx) {
    	let button;
    	let t_value = /*option*/ ctx[5].toUpperCase() + "";
    	let t;
    	let button_value_value;
    	let button_id_value;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			button.value = button_value_value = /*option*/ ctx[5];
    			attr_dev(button, "name", /*name*/ ctx[2]);
    			attr_dev(button, "id", button_id_value = /*option*/ ctx[5]);
    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(btnCls(/*i*/ ctx[7], /*options*/ ctx[1].length)) + " svelte-srnxl"));
    			toggle_class(button, "selected", /*option*/ ctx[5] === /*value*/ ctx[0]);
    			add_location(button, file$1, 28, 12, 667);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*setSelected*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*options*/ 2 && t_value !== (t_value = /*option*/ ctx[5].toUpperCase() + "")) set_data_dev(t, t_value);

    			if (dirty & /*options*/ 2 && button_value_value !== (button_value_value = /*option*/ ctx[5])) {
    				prop_dev(button, "value", button_value_value);
    			}

    			if (dirty & /*name*/ 4) {
    				attr_dev(button, "name", /*name*/ ctx[2]);
    			}

    			if (dirty & /*options*/ 2 && button_id_value !== (button_id_value = /*option*/ ctx[5])) {
    				attr_dev(button, "id", button_id_value);
    			}

    			if (dirty & /*options*/ 2 && button_class_value !== (button_class_value = "" + (null_to_empty(btnCls(/*i*/ ctx[7], /*options*/ ctx[1].length)) + " svelte-srnxl"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (dirty & /*options, options, value*/ 3) {
    				toggle_class(button, "selected", /*option*/ ctx[5] === /*value*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(28:8) {#each options as option, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*options*/ ctx[1].length > 1 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*options*/ ctx[1].length > 1) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function btnCls(i, len) {
    	if (i == 0) {
    		return "first";
    	} else if (i == len - 1) {
    		return "last";
    	} else {
    		return "middle";
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ButtonGroup', slots, []);
    	let { options = [] } = $$props;
    	let { value = options[0] } = $$props;
    	let { name } = $$props;
    	const dispatch = createEventDispatcher();

    	function setSelected(e) {
    		let changedTo = e.target.value;
    		$$invalidate(0, value = changedTo);
    		dispatch('change', { value });
    	}

    	const writable_props = ['options', 'value', 'name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ButtonGroup> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		options,
    		value,
    		name,
    		dispatch,
    		setSelected,
    		btnCls
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(1, options = $$props.options);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('name' in $$props) $$invalidate(2, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [value, options, name, setSelected];
    }

    class ButtonGroup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { options: 1, value: 0, name: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ButtonGroup",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[2] === undefined && !('name' in props)) {
    			console.warn("<ButtonGroup> was created without expected prop 'name'");
    		}
    	}

    	get options() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get name() {
    		throw new Error("<ButtonGroup>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<ButtonGroup>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.44.3 */

    const { Object: Object_1, console: console_1 } = globals;
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let center;
    	let div;
    	let quote_1;
    	let updating_sltn_key;
    	let t;
    	let buttongroup;
    	let current;

    	function quote_1_sltn_key_binding(value) {
    		/*quote_1_sltn_key_binding*/ ctx[6](value);
    	}

    	let quote_1_props = {
    		author: /*author*/ ctx[3],
    		quote: /*quote*/ ctx[2]
    	};

    	if (/*sltn_key*/ ctx[0] !== void 0) {
    		quote_1_props.sltn_key = /*sltn_key*/ ctx[0];
    	}

    	quote_1 = new Quote({ props: quote_1_props, $$inline: true });
    	binding_callbacks.push(() => bind(quote_1, 'sltn_key', quote_1_sltn_key_binding));

    	buttongroup = new ButtonGroup({
    			props: {
    				options: /*difficulties*/ ctx[4],
    				name: "Difficulty",
    				value: /*difficulty*/ ctx[1]
    			},
    			$$inline: true
    		});

    	buttongroup.$on("change", /*changeDifficulty*/ ctx[5]);

    	const block = {
    		c: function create() {
    			center = element("center");
    			div = element("div");
    			create_component(quote_1.$$.fragment);
    			t = space();
    			create_component(buttongroup.$$.fragment);
    			attr_dev(div, "class", "column svelte-scqo9z");
    			add_location(div, file, 82, 1, 1640);
    			attr_dev(center, "class", "svelte-scqo9z");
    			add_location(center, file, 81, 0, 1630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, div);
    			mount_component(quote_1, div, null);
    			append_dev(div, t);
    			mount_component(buttongroup, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const quote_1_changes = {};
    			if (dirty & /*author*/ 8) quote_1_changes.author = /*author*/ ctx[3];
    			if (dirty & /*quote*/ 4) quote_1_changes.quote = /*quote*/ ctx[2];

    			if (!updating_sltn_key && dirty & /*sltn_key*/ 1) {
    				updating_sltn_key = true;
    				quote_1_changes.sltn_key = /*sltn_key*/ ctx[0];
    				add_flush_callback(() => updating_sltn_key = false);
    			}

    			quote_1.$set(quote_1_changes);
    			const buttongroup_changes = {};
    			if (dirty & /*difficulty*/ 2) buttongroup_changes.value = /*difficulty*/ ctx[1];
    			buttongroup.$set(buttongroup_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(quote_1.$$.fragment, local);
    			transition_in(buttongroup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(quote_1.$$.fragment, local);
    			transition_out(buttongroup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(center);
    			destroy_component(quote_1);
    			destroy_component(buttongroup);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function resetKey(sltn_key) {
    	Object.keys(sltn_key).forEach(v => sltn_key[v] = " ");
    }

    async function queryRandomQuote(min, max) {
    	const apiURL = `https://api.quotable.io/random?minLength=${min}&maxLength=${max}`;
    	let quote = await fetch(apiURL);
    	quote = await quote.json();
    	return quote;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let sltn_key = {
    		"A": " ",
    		"B": " ",
    		"C": " ",
    		"D": " ",
    		"E": " ",
    		"F": " ",
    		"G": " ",
    		"H": " ",
    		"I": " ",
    		"J": " ",
    		"K": " ",
    		"L": " ",
    		"M": " ",
    		"N": " ",
    		"O": " ",
    		"P": " ",
    		"Q": " ",
    		"R": " ",
    		"S": " ",
    		"T": " ",
    		"U": " ",
    		"V": " ",
    		"W": " ",
    		"X": " ",
    		"Y": " ",
    		"Z": " "
    	};

    	const Difficulty = {
    		Easy: "Easy",
    		Medium: "Medium",
    		Hard: "Hard"
    	};

    	let difficulties = [...Object.values(Difficulty)];
    	let difficulty = Difficulty.Medium;

    	async function changeDifficulty(e) {
    		$$invalidate(1, difficulty = e.detail.value);
    		resetKey(sltn_key);
    		let quoteData = await getDifficultyQuote(difficulty);
    		$$invalidate(2, quote = await quoteData['content']);
    		console.log(quote);
    		$$invalidate(3, author = await quoteData['author']);
    	}

    	async function getDifficultyQuote(difficulty) {
    		if (difficulty === Difficulty.Easy) {
    			return await queryRandomQuote(50, 100);
    		} else if (difficulty === Difficulty.Medium) {
    			return await queryRandomQuote(101, 150);
    		} else if (difficulty === Difficulty.Hard) {
    			return await queryRandomQuote(151, 200);
    		} else {
    			return await queryRandomQuote(50, 200);
    		}
    	}

    	let quote = "Oops a quote should go here. Click a difficulty!";
    	let author = "Keagen Thomson";
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function quote_1_sltn_key_binding(value) {
    		sltn_key = value;
    		$$invalidate(0, sltn_key);
    	}

    	$$self.$capture_state = () => ({
    		Quote,
    		ButtonGroup,
    		sltn_key,
    		Difficulty,
    		difficulties,
    		difficulty,
    		resetKey,
    		changeDifficulty,
    		queryRandomQuote,
    		getDifficultyQuote,
    		quote,
    		author
    	});

    	$$self.$inject_state = $$props => {
    		if ('sltn_key' in $$props) $$invalidate(0, sltn_key = $$props.sltn_key);
    		if ('difficulties' in $$props) $$invalidate(4, difficulties = $$props.difficulties);
    		if ('difficulty' in $$props) $$invalidate(1, difficulty = $$props.difficulty);
    		if ('quote' in $$props) $$invalidate(2, quote = $$props.quote);
    		if ('author' in $$props) $$invalidate(3, author = $$props.author);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sltn_key,
    		difficulty,
    		quote,
    		author,
    		difficulties,
    		changeDifficulty,
    		quote_1_sltn_key_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
