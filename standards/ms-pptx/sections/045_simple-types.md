<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_1779aee15009459c9d81807811fcd0e7"></a><a id="_Toc174685936"></a>ST_TransitionCenterDirectionType

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[ST_TransitionCornerAndCenterDirectionType](#Section_ca059808c6b34e038b01f1d20b324a8d)

<a id="CC_28378b09000000000000000000000000"></a>A simple type that specifies a direction restricted to the center.	

Value

Meaning

center

<a id="CC_6d5da0e7000000000000000000000000"></a>Direction of movement is to or from the center.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_TransitionCenterDirectionType">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="center"/>
4.   </xsd:restriction>
5. </xsd:simpleType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_ca059808c6b34e038b01f1d20b324a8d"></a><a id="_Toc174685937"></a>ST_TransitionCornerAndCenterDirectionType

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_RippleTransition](#Section_053cdddd5f304beda1ff67e7b5759dd3)

<a id="CC_70881b58000000000000000000000000"></a>A simple type that specifies a direction restricted to the corners and center.

This simple type is a union of the following types:

- The __p:ST_TransitionCornerDirectionType__ simple type ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4)
- The __ST_TransitionCenterDirectionType__ simple type (section [2.3.4.1](#Section_1779aee15009459c9d81807811fcd0e7))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_TransitionCornerAndCenterDirectionType">
2.   <xsd:union memberTypes="p:ST_TransitionCornerDirectionType ST_TransitionCenterDirectionType"/>
3. </xsd:simpleType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_397e4c1e2ed74beba84b3d82c7aa03a5"></a><a id="_Toc174685938"></a>ST_TransitionLeftRightDirectionType

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_LeftRightDirectionTransition](#Section_56ea32ef98ad4bfbb57220a99c86c4d8), [CT_RevealTransition](#Section_eb6d865240724c1f957f548ee3ab1584)

<a id="CC_77bbba8d000000000000000000000000"></a>A simple type that specifies a direction restricted to the values of left and right.

Value

Meaning

l

<a id="CC_0751dfd8000000000000000000000000"></a>Left

r

<a id="CC_22297f5e000000000000000000000000"></a>Right

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_TransitionLeftRightDirectionType">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="l"/>
4.     <xsd:enumeration value="r"/>
5.   </xsd:restriction>
6. </xsd:simpleType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_ec144032652d4dbb8d3ceccc12409a84"></a><a id="_Toc174685939"></a>ST_TransitionPattern

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_GlitterTransition](#Section_93a73ee56799478f8c1f3db23726e10e)

<a id="CC_366412a0000000000000000000000000"></a>A simple type that specifies a geometric pattern that tiles together to fill a larger area.

Value

Meaning

diamond

<a id="CC_a59cd10f000000000000000000000000"></a>Diamond tile pattern

hexagon

<a id="CC_f2a25a48000000000000000000000000"></a>Hexagon tile pattern

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_TransitionPattern">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="diamond"/>
4.     <xsd:enumeration value="hexagon"/>
5.   </xsd:restriction>
6. </xsd:simpleType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_af9e4ab58e0648719aeeedda326fe3de"></a><a id="_Toc174685940"></a>ST_TransitionShredPattern

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_ShredTransition](#Section_c579b0ad29fc450ebea918d8190b0b44)

<a id="CC_ffb18fe6000000000000000000000000"></a>A simple type that specifies a geometric shape that tiles together to fill a larger area. 

Value

Meaning

strip

<a id="CC_e98d13e9000000000000000000000000"></a>Vertical strips

rectangle

<a id="CC_8cb2d763000000000000000000000000"></a>Small rectangles

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_TransitionShredPattern">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="strip"/>
4.     <xsd:enumeration value="rectangle"/>
5.   </xsd:restriction>
6. </xsd:simpleType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a3ead080d9cb4b4a80146d815248c23b"></a><a id="_Toc174685941"></a>ST_UniversalTimeOffset

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[dur](#Section_9032bdb2b273470b8ac4c98a8c944494), [CT_MediaTrim](#Section_c835eea3fd6f40558a5792b193b7b2e3), [CT_MediaFade](#Section_16dcdeabc7544980a435763affd13817), [CT_MediaBookmark](#Section_2594f161c0314cf39608657c32deef77), [CT_LaserTracePoint](#Section_677516c6a4bb4920971e50f951e27df8), [CT_TriggerEventRecord](#Section_7169d50e01264777a072c615e9d9b489), [CT_NullEventRecord](#Section_20d7137fba0a49e4b66967263a8161c3), [CT_MediaPlaybackEventRecord](#Section_405a46f6e9da44baa6002b1eb59d07c8), [CT_MediaSeekEventRecord](#Section_23f1dc1973c64e7aa9ea11007f2a8821), [CT_ZoomObjectProperties](#Section_059e3722139d4e419841d53eecaf73f6)

<a id="CC_356cae79000000000000000000000000"></a>A simple type that specifies an amount of time. It MUST be a valid TIMEOFFSET as specified in the following ABNF [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096) grammar:

TIMEOFFSET = TIME [UNITS]

TIME = 1*DIGIT ["." 1*DIGIT]

UNITS = "h" / "min" / "s" / "ms" / "µs" / "ns"

UNITS specifies one of the following units of time:

Abbreviation

Unit of Time

h

Hour

min

Minute

s

Second

ms

Millisecond

µs

Microsecond

ns

Nanosecond

If no unit is specified, the default is millisecond.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_UniversalTimeOffset">
2.   <xsd:restriction base="xsd:string"/>
3. </xsd:simpleType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
