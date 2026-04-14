compile:
	cargo build --target wasm32-unknown-unknown --release

bindgen:
	wasm-bindgen target/wasm32-unknown-unknown/release/trek_ui.wasm \
		--out-dir dist/wasm \
		--no-demangle \
		--target web \
		--typescript 

	wasm-opt dist/wasm/trek_ui_bg.wasm \
		-o dist/wasm/trek_ui_bg.wasm \
		-O3 \
		--strip-debug

build:
	just compile
	just bindgen