'use strict';

const Realm = require('realm');
const {EJSON} = require('bson');
const {assertEqual} = require('./asserts');

function bson_parse(json) {
    return EJSON.parse(json, {relaxed: false});
}

function realm_parse(json) {
    return Realm['_bsonParseJsonForTest'](json);
}

function assert_fancy_eq(a, b) {
    a = EJSON.stringify(a, {relaxed:false});
    b = EJSON.stringify(b, {relaxed:false});
    if (0) { // Toggling can make debugging easier
        console.log(a);
        console.log(b);
    }
    assertEqual(a, b);
}

function check(val) {
    const json = JSON.stringify({val});
    assert_fancy_eq(realm_parse(json), bson_parse(json));
}

const values = {
    null: null,
    minkey: {$minKey: 1},
    maxkey: {$maxKey: 1},

    string: "hello",
    boolT: true,
    bool_f: false,

    simple_double: 1.1,
    //simple_intish_double: 1, // XXX

    decimal: {$numberDecimal: "1.1"},
    double: {$numberDouble: "1.1"},
    int: {$numberInt: "1"},
    long: {$numberLong: "123"},

    //timestamp: {$timestamp: {t: 1234, i: 5678}}, // XXX
    //date: {$date: "2015-10-21T04:29:00.123"}, // XXX
    //date_overflow_32_bit_time_t: {$date: "2215-10-21T04:29:00.123"}, // XXX

    binary: {$binary: {base64: "c2hpYmJvbGV0aA==", subType: "0"}}, // XXX

    oid: {$oid: "123456789012345678901234"},
    regex: {$regularExpression: {pattern: "match this", options: "ims"}},

    object: {a: 1.1, b:2.2, c: "sea"},
    object_nested: {nested: {object: 1.1}},
    array: ["a", "b", "c"],
    //array_nested: ["a", [{"b": ["c", []]}]], // XXX
};
for (let name in values) {
    exports[`test_val_${name}`] = () => check(values[name]);
}
