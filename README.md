# minecraft-packets

Stores minecraft packets to test implementation of the minecraft protocol

## What can the packets be used for

The packets provided as raw can be used to test _any_ implementation of minecraft's protocol, using cycle test.
Cycle tests just means parsing something, then going back to the format it was in before and seeing if they are equal.
In pseudocode, an example of this would be: `dump(parse(data)) == data`, with data being tested. An example
implementation in nodejs is linked [here](https://github.com/PrismarineJS/node-minecraft-packets/blob/master/test/cycle.test.js).

## Folder Structure

data/(platform)/(version)/(data) => packets

doc/ => data

## Wrappers

| Name | Language |
| --- | --- |
| [node-minecraft-packets](https://github.com/PrismarineJS/node-minecraft-packets) | Node.js

If you want to use minecraft-packets in a new language, we advise you to [create a new wrapper](https://github.com/PrismarineJS/minecraft-data/blob/master/doc/make-a-new-wrapper.md)
