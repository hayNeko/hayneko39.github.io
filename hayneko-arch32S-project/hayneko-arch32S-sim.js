"use strict"

const ISA_INT_GENERAL_PURPOSE_REGISTERS = {
    "x0":  0,  "ra": 1,   "rb": 2,   "rc": 3,   "rd": 4,   "ri": 5,   "sp": 6,   "bp": 7,
    "r8":  8,  "r9": 9,   "r10": 10, "r11": 11, "r12": 12, "r13": 13, "r14": 14, "r15": 15,
    "r16": 16, "r17": 17, "r18": 18, "r19": 19, "r20": 20, "r21": 21, "r22": 22, "r23": 23,
    "t0":  24, "t1": 25,  "t2": 26,  "t3": 27,  "t4": 28,  "t5": 29,  "t6": 30,  "t7": 31,
}

const ISA_FLOAT_GENERAL_PURPOSE_REGISTERS = {
    "f0": 0,  "f1": 1,  "f2": 2,   "f3": 3,   "f4": 4,   "f5": 5,   "f6": 6,   "f7": 7,
    "f8": 8,  "f9": 9,  "f10": 10, "f11": 11, "f12": 12, "f13": 13, "f14": 14, "f15": 15,
    "d0": 16, "d1": 17, "d2": 18,  "d3": 19,  "d4": 20,  "d5": 21,  "d6": 22,  "d7": 23,
    "d8": 24, "d9": 25, "d10": 26, "d11": 27, "d12": 28, "d13": 29, "d14": 30, "d15": 31
}

const ISA_SYSTEM_REGISTERS = {
    "pc": 0, "fl": 1, "mode": 2, "idt": 3
}

let runtime_general_purpose_registers = new Array(32).fill(0);
let runtime_float_general_purpose_registers = new Array(32).fill(0);
let runtime_system_registers = new Array(4).fill(0);

class Assembler {
    constructor() {

    }

    
}