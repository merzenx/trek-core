use wasm_bindgen::prelude::*;

/// Adds two integers.
///
/// # Arguments
///
/// * `n` - Number of iterations.
///
/// # Returns
///
/// Last number.
#[wasm_bindgen]
pub fn loop_with_count(n: i32) -> i32 {
    let mut v = Vec::with_capacity(n as usize);
    for i in 1..=n {
        v.push(i);
    }
    v.pop().unwrap()
}

/// Linear interpolation.
///
/// # Arguments
///
/// * `a` - Start value.
/// * `b` - End value.
/// * `t` - Interpolation factor.
///
/// # Returns
///
/// Interpolated value.
#[wasm_bindgen]
pub fn bezier_linear(a: f64, b: f64, t: f64) -> f64 {
    (1.0 - t) * a + t * b
}

/// Quadratic Bezier interpolation.
///
/// # Arguments
///
/// * `a` - Start value.
/// * `b` - Control value.
/// * `c` - End value.
/// * `t` - Interpolation factor.
///
/// # Returns
///
/// Interpolated value.
#[wasm_bindgen]
pub fn bezier_quadratic(a: f64, b: f64, c: f64, t: f64) -> f64 {
    a + (b - a) * t + (c - b) * t
}

/// Fibonacci sequence.
///
/// # Arguments
///
/// * `n` - Number of iterations.
///
/// # Returns
///
/// Fibonacci number.
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}
