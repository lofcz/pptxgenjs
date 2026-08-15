<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_aea110ba98b34216971bb8b996375f0b"></a><a id="_Toc174685904"></a>CT_BrowseMode

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[browseMode](#Section_f500c032002b44b884fcada145d84bf3)

<a id="CC_db29749d000000000000000000000000"></a>A complex type that specifies the visibility of the status bar in [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b) browse mode.

*Attributes:*

<a id="CC_1683988e000000000000000000000000"></a>__showStatus: __An __xsd:boolean__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) that specifies the visibility of status bar when slide show is in browse mode.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_BrowseMode">
2.   <xsd:attribute name="showStatus" type="xsd:boolean" use="optional" default="true"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_bda997a4aa4142aa9c09512c7e4fc5bc"></a><a id="_Toc174685905"></a>CT_ContentPartNonVisual

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[nvContentPartPr](#Section_160202ae324149c8aad23f8e5e043602)

<a id="CC_8900894a000000000000000000000000"></a>A complex type which specifies non-visual properties for a __contentPart__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.14).

*Child Elements:*

<a id="CC_a388e788000000000000000000000000"></a>__cNvPr: __An __a:CT_NonVisualDrawingProps__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the non-visual drawing properties for the content part. This element allows for additional information that does not affect the appearance of the content part to be stored.

<a id="CC_9a8e9603000000000000000000000000"></a>__cNvContentPartPr: __An __a14:CT_NonVisualInkContentPartProperties__ element ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.3.3.7) that specifies non-visual [__ink__](#gt_9fcdd1d5-3563-49b9-8a2e-bf696fb08fd0) properties for the content part. This element allows for additional information that does not affect the appearance of ink in the content part to be stored.

<a id="CC_7f7f1fca000000000000000000000000"></a>__nvPr: __A __p:CT_ApplicationNonVisualDrawingProps__ element ([ISO/IEC29500-4:2016] section A.4) that specifies PresentationML Drawing specific non-visual properties for the content part.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ContentPartNonVisual">
2.   <xsd:sequence>
3.     <xsd:element name="cNvPr" type="a:CT_NonVisualDrawingProps" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="cNvContentPartPr" type="a14:CT_NonVisualInkContentPartProperties" minOccurs="0" maxOccurs="1"/>
5.     <xsd:element name="nvPr" type="p:CT_ApplicationNonVisualDrawingProps" minOccurs="1" maxOccurs="1"/>
6.   </xsd:sequence>
7. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_5099194613ca4ee48efb20d8f4770a17"></a><a id="_Toc174685906"></a>CT_DefaultImageDpi

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[defaultImageDpi](#Section_28952ea67e824ce787a9d76f9ed0fa91)

<a id="CC_6fb58ac2000000000000000000000000"></a>A complex type that specifies the default dpi to use when saving each image in the document.

*Attributes:*

<a id="CC_e32df886000000000000000000000000"></a>__val: __An __xsd:unsignedInt__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.22) that specifies the dpi.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DefaultImageDpi">
2.   <xsd:attribute name="val" type="xsd:unsignedInt" use="required"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_adc484a16e66459ba53b74ff23ad806c"></a><a id="_Toc174685907"></a>CT_DiscardImageEditData

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[discardImageEditData](#Section_ec51c8866e0f4fa183a6a33ca3cea0aa)

<a id="CC_91c640c7000000000000000000000000"></a>A complex type that specifies whether to discard editing data for images when saving.

*Attributes:*

<a id="CC_24a5624c000000000000000000000000"></a>__val: __An __xsd:boolean__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) that specifies whether to discard image editing data when saving.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DiscardImageEditData">
2.   <xsd:attribute name="val" type="xsd:boolean" use="required"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9cb735d9285e41ea9303c0ed13bd9931"></a><a id="_Toc174685908"></a>CT_FlyThroughTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[flythrough](#Section_71a951a17d6d45779b032fb84632deb2)

<a id="CC_2e63c435000000000000000000000000"></a>A complex type that specifies the parameters for a fly-through transition.

*Attributes:*

<a id="CC_c867c89a000000000000000000000000"></a>__dir: __ A __p:ST_TransitionInOutDirectionType__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies the direction [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) move during the transition. 

<a id="CC_f8b3a8c3000000000000000000000000"></a>__hasBounce: __An __xsd:boolean__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) that specifies that the movement of the presentation slides during the transition includes a bounce. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_FlyThroughTransition">
2.   <xsd:attribute name="dir" type="p:ST_TransitionInOutDirectionType" use="optional" default="in"/>
3.   <xsd:attribute name="hasBounce" type="xsd:boolean" use="optional" default="false"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_93a73ee56799478f8c1f3db23726e10e"></a><a id="_Toc174685909"></a>CT_GlitterTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[glitter](#Section_c78988eeb178452392176d18df30f674)

<a id="CC_a8c681eb000000000000000000000000"></a>A complex type that specifies the parameters for a glitter transition.

*Attributes:*

<a id="CC_bf9804d6000000000000000000000000"></a>__dir: __A __p:ST_TransitionSideDirectionType__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies the direction [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) move during the transition. 

<a id="CC_82df3067000000000000000000000000"></a>__pattern: __An __ST_TransitionPattern__ (section [2.3.4.4](#Section_ec144032652d4dbb8d3ceccc12409a84)) attribute that specifies the shape of the visuals used during the transition. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_GlitterTransition">
2.   <xsd:attribute name="dir" type="p:ST_TransitionSideDirectionType" use="optional" default="l"/>
3.   <xsd:attribute name="pattern" type="ST_TransitionPattern" use="optional" default="diamond"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7fdb78abb82145efa5c0923f3804c528"></a><a id="_Toc174685910"></a>CT_LaserTrace

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_LaserTraceList](#Section_b35b724f590b480ab5b772e97735c2b2)

<a id="CC_a7e7f187000000000000000000000000"></a>A complex type that specifies a list of laser trace points. The first point in the list of points specifies when and where the laser point appears. The last point in the list of points specifies when and where the laser point disappears. Other trace points in the list of points specify laser point appearance time and locations.

*Child Elements:*

<a id="CC_08505ed0000000000000000000000000"></a>__tracePt: __A __CT_LaserTracePoint__ element (section [2.3.3.9](#Section_677516c6a4bb4920971e50f951e27df8)) that specifies a location of the laser point.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_LaserTrace">
2.   <xsd:sequence>
3.     <xsd:element name="tracePt" type="CT_LaserTracePoint" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_b35b724f590b480ab5b772e97735c2b2"></a><a id="_Toc174685911"></a>CT_LaserTraceList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[laserTraceLst](#Section_a0466c2453384edc920a3d095aa8738a)

<a id="CC_599991a6000000000000000000000000"></a>A complex type that specifies a list of laser traces.

*Child Elements:*

<a id="CC_939bde42000000000000000000000000"></a>__tracePtLst: __A __CT_LaserTrace__ element (section [2.3.3.7](#Section_7fdb78abb82145efa5c0923f3804c528)) that specifies a laser trace.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_LaserTraceList">
2.   <xsd:sequence>
3.     <xsd:element name="tracePtLst" type="CT_LaserTrace" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_677516c6a4bb4920971e50f951e27df8"></a><a id="_Toc174685912"></a>CT_LaserTracePoint

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_LaserTrace](#Section_7fdb78abb82145efa5c0923f3804c528)

<a id="CC_10576e73000000000000000000000000"></a>A complex type that specifies the time and location of the laser pointer on a [__presentation slide__](#gt_18428521-9032-41a4-85c4-6fb65d882192).

*Attributes:*

<a id="CC_952d571e000000000000000000000000"></a>__t: __An __ST_UniversalTimeOffset__ attribute (section [2.3.4.6](#section_a3ead080d9cb4b4a80146d815248c23b)) that specifies the time relative to the beginning of the slide timeline and not including transition time.

<a id="CC_952d5712000000000000000000000000"></a>__x: __An __a:ST_Coordinate__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the horizontal location relative to the top-left corner of the presentation slide.

<a id="CC_952d5713000000000000000000000000"></a>__y: __An __a:ST_Coordinate__ attribute ([ISO/IEC29500-4:2016] section A.5.1) that specifies the vertical location relative to the top-left corner of the presentation slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_LaserTracePoint">
2.   <xsd:attribute name="t" type="p14:ST_UniversalTimeOffset" use="required"/>
3.   <xsd:attribute name="x" type="a:ST_Coordinate" use="required"/>
4.   <xsd:attribute name="y" type="a:ST_Coordinate" use="required"/>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_56ea32ef98ad4bfbb57220a99c86c4d8"></a><a id="_Toc174685913"></a>CT_LeftRightDirectionTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[switch](#Section_3da05579946146e2a1c732fe2092bba6), [flip](#Section_02b192a9284c40e5aa3ca89c5f6f66cc), [ferris](#Section_e326a2fa25bd43a490f2f0356d5f6405), [gallery](#Section_7e9eb7c83945419bb3787672b6133425), [conveyor](#Section_e0aeee44571e49c8a753e7a8dd2026bb)

<a id="CC_6f43eb29000000000000000000000000"></a>A complex type that specifies a transition restricted to left and right directions.

*Attributes:*

<a id="CC_dcdd0264000000000000000000000000"></a>__dir: __An __ST_TransitionLeftRightDirectionType__ attribute (section [2.3.4.3](#Section_397e4c1e2ed74beba84b3d82c7aa03a5)) that specifies the direction [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) move during the transition.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_LeftRightDirectionTransition">
2.   <xsd:attribute name="dir" type="ST_TransitionLeftRightDirectionType"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_2594f161c0314cf39608657c32deef77"></a><a id="_Toc174685914"></a>CT_MediaBookmark

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_MediaBookmarkList](#Section_a3c0d72cf3c94fbb8b247422f71ae45e)

<a id="CC_34073c14000000000000000000000000"></a>A complex type that specifies a media bookmark on the media.

*Attributes:*

<a id="CC_4382d993000000000000000000000000"></a>__name: __An xsd:string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies the name for the bookmark. The bookmark name MUST be unique among all bookmarks in its parent __CT_MediaBookmarkList__ (section 2.3.3.12).

<a id="CC_cebe1df1000000000000000000000000"></a>__time: __An __ST_UniversalTimeOffset__ attribute (section [2.3.4.6](#Section_a3ead080d9cb4b4a80146d815248c23b)) that specifies the time of the bookmark relative to the beginning of the media. It MUST be unique among all bookmarks in its parent __CT_MediaBookmarkList__ (section 2.3.3.12). It MUST be less than or equal to the length of the media.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MediaBookmark">
2.   <xsd:attribute name="name" type="xsd:string"/>
3.   <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a3c0d72cf3c94fbb8b247422f71ae45e"></a><a id="_Toc174685915"></a>CT_MediaBookmarkList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_Media](#Section_f8b7e1cb976e4f388139f9e5ffa826e8)

<a id="CC_c1936f10000000000000000000000000"></a>A complex type that specifies a list of media bookmarks on the media.

*Child Elements:*

<a id="CC_04bf9e2f000000000000000000000000"></a>__bmk: __A __CT_MediaBookmark__ element (section [2.3.3.11](#Section_2594f161c0314cf39608657c32deef77)) that specifies a bookmark name and time. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MediaBookmarkList">
2.   <xsd:sequence>
3.     <xsd:element name="bmk" type="CT_MediaBookmark" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_f27090527a54446e94c3fa0bced8c775"></a><a id="_Toc174685916"></a>CT_MediaBookmarkTarget

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[bmkTgt](#Section_7a7c9c0b9ceb4cac909fbd57f052c863)

<a id="CC_60ca10c5000000000000000000000000"></a>A complex type that specifies a media bookmark that triggers an animation.

*Attributes:*

<a id="CC_c1869b9d000000000000000000000000"></a>__spid: __An __a:ST_DrawingElementId__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the [__shape identifier__](#gt_10fbabb4-d33a-4b89-bedd-17cd448fba2b) of the [__shape__](#gt_d0e38aa4-2c71-4a6f-b5e6-75766fa9409e) that contains video or audio data. 

<a id="CC_58334df5000000000000000000000000"></a>__bmkName: __An __xsd:string__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the name of the bookmark for the media that is contained in the shape specified by __spid__. The name MUST exist in the __CT_MediaBookmarkList__ (section [2.3.3.12](#Section_a3c0d72cf3c94fbb8b247422f71ae45e)) contained by the media.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MediaBookmarkTarget">
2.   <xsd:attribute name="spid" type="a:ST_DrawingElementId" use="required"/>
3.   <xsd:attribute name="bmkName" type="xsd:string" use="required"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_f8b7e1cb976e4f388139f9e5ffa826e8"></a><a id="_Toc174685917"></a>CT_Media

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[media](#Section_3d88e290a4a94db29457b04687c06cf5)

<a id="CC_716f3d84000000000000000000000000"></a>A complex type that specifies the media.

*Child Elements:*

<a id="CC_b2a4ccc1000000000000000000000000"></a>__trim: __A __CT_MediaTrim__ element (section [2.3.3.18](#Section_c835eea3fd6f40558a5792b193b7b2e3)) that specifies the amount of time to be trimmed from the start and end of the media during playback.

<a id="CC_690f743a000000000000000000000000"></a>__fade: __A __CT_MediaFade__ element (section [2.3.3.15](#Section_16dcdeabc7544980a435763affd13817)) that specifies the starting and ending fade durations for the media.

<a id="CC_22c86505000000000000000000000000"></a>__bmkLst: __A __CT_MediaBookmarkList__ element (section [2.3.3.12](#Section_a3c0d72cf3c94fbb8b247422f71ae45e)) that specifies a list of bookmarks on the media.

<a id="CC_2b29778e000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the media will be stored in the extension list.

*Attributes:*

<a id="CC_0b52c6a0000000000000000000000000"></a>__r:embed: __A __r:ST_RelationshipId__ ([ISO/IEC29500-4:2016] section A.8.8) attribute that specifies the relationship identifier that is used to determine the location of the media if it is embedded in the document. The __r:embed__ attribute MUST be present if the __r:link__ attribute is not present. If both the __r:embed __and __r:link __attributes are present, the __r:link __attribute takes precedence.

<a id="CC_0a3df43e000000000000000000000000"></a>__r:link: __A __r:ST_RelationshipId__ ([ISO/IEC29500-4:2016] section A.8.8) attribute that specifies the relationship identifier that is used to determine the location of the media if it is linked from the document. The __r:link__ attribute MUST be present if the __r:embed __attribute is not present. If both the __r:link __and __r:embed __attributes are present, the __r:link __attribute takes precedence.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_Media">
2.   <xsd:sequence>
3.     <xsd:element name="trim" type="CT_MediaTrim" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="fade" type="CT_MediaFade" minOccurs="0" maxOccurs="1"/>
5.     <xsd:element name="bmkLst" type="CT_MediaBookmarkList" minOccurs="0" maxOccurs="1"/>
6.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
7.   </xsd:sequence>
8.   <xsd:attributeGroup ref="a:AG_Blob"/>
9. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_16dcdeabc7544980a435763affd13817"></a><a id="_Toc174685918"></a>CT_MediaFade

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_Media](#Section_f8b7e1cb976e4f388139f9e5ffa826e8)

<a id="CC_01135340000000000000000000000000"></a>A complex type that specifies the media fade.

*Attributes:*

<a id="CC_10e53b0a000000000000000000000000"></a>__in: __An __ST_UniversalTimeOffset__ (section [2.3.4.6](#Section_a3ead080d9cb4b4a80146d815248c23b)) attribute that specifies the duration of the starting fade. It MUST be less than or equal to the total length of the media minus the __out__.

<a id="CC_13673914000000000000000000000000"></a>__out: __An __ST_UniversalTimeOffset__ attribute that specifies the duration of the ending fade. It MUST be less than or equal to the total length of the media minus the __in__.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MediaFade">
2.   <xsd:attribute name="in" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
3.   <xsd:attribute name="out" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_405a46f6e9da44baa6002b1eb59d07c8"></a><a id="_Toc174685919"></a>CT_MediaPlaybackEventRecord

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_ShowEventRecordList](#Section_c2e6338edcee4f62b70bfb7410ed8c03)

<a id="CC_0f18009b000000000000000000000000"></a>A complex type that specifies a media playback event that occurs during [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b). 

*Attributes:*

<a id="CC_8b4a1bb9000000000000000000000000"></a>__time: __An __ST_UniversalTimeOffset__ (section [2.3.4.6](#section_a3ead080d9cb4b4a80146d815248c23b)) attribute that specifies the time that the event occurs. The value is relative to the beginning of the slide timeline, which does not include side transition time.

<a id="CC_b3c44bca000000000000000000000000"></a>__objId: __An __a:ST_DrawingElementId__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the identifier of the media object on the slide that is the target of the event.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MediaPlaybackEventRecord">
2.   <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
3.   <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_23f1dc1973c64e7aa9ea11007f2a8821"></a><a id="_Toc174685920"></a>CT_MediaSeekEventRecord

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_ShowEventRecordList](#Section_c2e6338edcee4f62b70bfb7410ed8c03)

<a id="CC_e3e4e761000000000000000000000000"></a>A complex type that specifies a media seek event that occurs during [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b). 

*Attributes:*

<a id="CC_16607fa0000000000000000000000000"></a>__time: __An __ST_UniversalTimeOffset__ attribute (section [2.3.4.6](#section_a3ead080d9cb4b4a80146d815248c23b)) that specifies the time that the event occurs. The value is relative to the beginning of the slide timeline, which does not include slide transition time.

<a id="CC_e8384f47000000000000000000000000"></a>__objId: __An __a:ST_DrawingElementId__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the identifier of the media object on the slide that is the target of this event.

<a id="CC_1afc085e000000000000000000000000"></a>__seek: __An __ST_UniversalTimeOffset__ attribute (section 2.3.4.6) that specifies the time of the position to seek to in the media stream.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MediaSeekEventRecord">
2.   <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
3.   <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
4.   <xsd:attribute name="seek" type="p14:ST_UniversalTimeOffset" use="required"/>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c835eea3fd6f40558a5792b193b7b2e3"></a><a id="_Toc174685921"></a>CT_MediaTrim

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_Media](#Section_f8b7e1cb976e4f388139f9e5ffa826e8)

<a id="CC_c9b25eb6000000000000000000000000"></a>A complex type that specifies the amount of time to be trimmed from the start and end of the media during playback.

*Attributes:*

<a id="CC_e6853335000000000000000000000000"></a>__st: __An __ST_UniversalTimeOffset__ attribute (section [2.3.4.6](#section_a3ead080d9cb4b4a80146d815248c23b)) that specifies a duration of time to be removed from the start of the media during playback. It MUST be less than the total length of the media minus the __end__.

<a id="CC_2477c522000000000000000000000000"></a>__end: __An __ST_UniversalTimeOffset __attribute (section 2.3.4.6) that specifies a duration of time to be removed from the end of the media during playback. It MUST be less than the total length of the media minus the __st__.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MediaTrim">
2.   <xsd:attribute name="st" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
3.   <xsd:attribute name="end" type="p14:ST_UniversalTimeOffset" use="optional" default="0"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_20d7137fba0a49e4b66967263a8161c3"></a><a id="_Toc174685922"></a>CT_NullEventRecord

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_ShowEventRecordList](#Section_c2e6338edcee4f62b70bfb7410ed8c03)

<a id="CC_7445999c000000000000000000000000"></a>A complex type that specifies an unknown event in [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b). This is for future extension.

*Attributes:*

<a id="CC_383292a8000000000000000000000000"></a>__time: __An __ST_UniversalTimeOffset__ attribute (section [2.3.4.6](#section_a3ead080d9cb4b4a80146d815248c23b)) that specifies the time that the event occurs. The value is relative to the beginning of the slide timeline, which does not include slide transition time.

<a id="CC_c0c5279d000000000000000000000000"></a>__objId: __An __a:ST_DrawingElementId__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the identifier of the shape object on the slide that is the target of this event.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_NullEventRecord">
2.   <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
3.   <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_79f003b6811b4225a0f630a3b58d663d"></a><a id="_Toc174685923"></a>CT_PrismTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[prism](#Section_52f75e750b724e82ab576474229e751c)

<a id="CC_833a6f9a000000000000000000000000"></a>A complex type that specifies the parameters for a prism transition.

*Attributes:*

<a id="CC_476f8cd1000000000000000000000000"></a>__dir: __A __p:ST_TransitionSideDirectionType__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies the direction [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) move during the transition. 

<a id="CC_8dc489d5000000000000000000000000"></a>__isContent: __An __xsd:boolean__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) that specifies whether the visual representation draws presentation slide content and presentation slide background separately.  

<a id="CC_0cbd69a5000000000000000000000000"></a>__isInverted: __An __xsd:boolean__ attribute ([XMLSCHEMA2/2] section 3.2.2) that specifies whether the layout of the presentation slides during the transition is concave instead of convex. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_PrismTransition">
2.   <xsd:attribute name="dir" type="p:ST_TransitionSideDirectionType" use="optional" default="l"/>
3.   <xsd:attribute name="isContent" type="xsd:boolean" use="optional" default="false"/>
4.   <xsd:attribute name="isInverted" type="xsd:boolean" use="optional" default="false"/>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_853d9ddb5e614bc78e073e3d05f27e2c"></a><a id="_Toc174685924"></a>CT_RandomId

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[creationId](#Section_82a107ddbeeb46468bd248f433e1d62e), [modId](#Section_c7f10e508b6f42e09926e1d15f6a4861)

<a id="CC_af9d61c1000000000000000000000000"></a>A complex type that specifies a cryptographically strong random number.

*Attributes:*

<a id="CC_e7f0f3cb000000000000000000000000"></a>__val: __An __xsd:unsignedInt__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.22) that specifies the random number.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_RandomId">
2.   <xsd:attribute name="val" type="xsd:unsignedInt" use="required"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_eb6d865240724c1f957f548ee3ab1584"></a><a id="_Toc174685925"></a>CT_RevealTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[reveal](#Section_830962fcea324de9b0c5ba5e2a8a9bb3)

<a id="CC_ebe81063000000000000000000000000"></a>A complex type that specifies the parameters for a reveal transition.

*Attributes:*

<a id="CC_173b1f07000000000000000000000000"></a>__thruBlk: __An __xsd:boolean__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) that specifies whether the transition fades through black.

<a id="CC_e434eae1000000000000000000000000"></a>__dir: __An [__ST_TransitionLeftRightDirectionType__](#Section_397e4c1e2ed74beba84b3d82c7aa03a5) attribute (section 2.3.4.3) that specifies the direction [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) move during the transition. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_RevealTransition">
2.   <xsd:attribute name="thruBlk" type="xsd:boolean" use="optional" default="false"/>
3.   <xsd:attribute name="dir" type="ST_TransitionLeftRightDirectionType" use="optional" default="l"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_053cdddd5f304beda1ff67e7b5759dd3"></a><a id="_Toc174685926"></a>CT_RippleTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[ripple](#Section_c1c9b4f579c04e2f8b59db2b4cee9f00)

<a id="CC_4b132c38000000000000000000000000"></a>A complex type that specifies the parameters for a ripple transition.

*Attributes:*

<a id="CC_d4426667000000000000000000000000"></a>__dir: __An __ST_TransitionCornerAndCenterDirectionType__ attribute (section [2.3.4.2](#Section_ca059808c6b34e038b01f1d20b324a8d)) that specifies the direction [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) move during the transition. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_RippleTransition">
2.   <xsd:attribute name="dir" type="ST_TransitionCornerAndCenterDirectionType" use="optional" default="center"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_5bb610d5ced844eda4b6cd3d5f938906"></a><a id="_Toc174685927"></a>CT_Section

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_SectionList](#Section_b499c39b7c504a5888e6f86e6046be50)

<a id="CC_4ffcdcba000000000000000000000000"></a>A complex type that specifies a section and its properties. 

*Child Elements:*

<a id="CC_9f352f2b000000000000000000000000"></a>__sldIdLst: __A [__CT_SectionSlideIdList__](#Section_7bde17721da34311b7f1dcf5f7fe96c4) element (section 2.3.3.26) that specifies a list of [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) in a section.

<a id="CC_60a6646a000000000000000000000000"></a>__extLst: __ A __p:CT_ExtensionList __element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) that specifies the extension list. All future extensions to the section will be stored in the extension list.

*Attributes:*

<a id="CC_dca98599000000000000000000000000"></a>__name: __An __xsd:string__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) that specifies the name of the section.

<a id="CC_7a3dcd25000000000000000000000000"></a>__id: __A __s:ST_Guid__ attribute ([ISO/IEC29500-4:2016] section A.8.9) that specifies a [__GUID__](#gt_f49694cc-c350-462d-ab8e-816f0103c6c1) used to uniquely identify a section in the __CT_SectionList __(section 2.3.3.25).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_Section">
2.   <xsd:sequence>
3.     <xsd:element name="sldIdLst" type="CT_SectionSlideIdList" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="name" type="xsd:string"/>
7.   <xsd:attribute name="id" type="s:ST_Guid"/>
8. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_b499c39b7c504a5888e6f86e6046be50"></a><a id="_Toc174685928"></a>CT_SectionList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[sectionLst](#Section_db88eca9e5d04fc6b1c95387557998bd)

<a id="CC_3cab8e13000000000000000000000000"></a>A complex type that specifies section properties for the document.

*Child Elements:*

<a id="CC_539f8056000000000000000000000000"></a>__section: __A __CT_Section__ element (section [2.3.3.24](#Section_5bb610d5ced844eda4b6cd3d5f938906)) that specifies a section in the document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SectionList">
2.   <xsd:sequence>
3.     <xsd:element name="section" type="CT_Section" minOccurs="1" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7bde17721da34311b7f1dcf5f7fe96c4"></a><a id="_Toc174685929"></a>CT_SectionSlideIdList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_Section](#Section_5bb610d5ced844eda4b6cd3d5f938906)

<a id="CC_d1b8e49f000000000000000000000000"></a>A complex type that specifies the list of [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) that belong to a section.

*Child Elements:*

<a id="CC_2f1860fd000000000000000000000000"></a>__sldId: __A __CT_SectionSlideIdListEntry__ element (section [2.3.3.27](#Section_732254240c3d44a88908eb9500460125)) that specifies an identifier of a presentation slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SectionSlideIdList">
2.   <xsd:sequence>
3.     <xsd:element name="sldId" type="CT_SectionSlideIdListEntry" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_732254240c3d44a88908eb9500460125"></a><a id="_Toc174685930"></a>CT_SectionSlideIdListEntry

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_SectionSlideIdList](#Section_7bde17721da34311b7f1dcf5f7fe96c4)

<a id="CC_35986bae000000000000000000000000"></a>A complex type that specifies the [__presentation slide__](#gt_18428521-9032-41a4-85c4-6fb65d882192) identifier.

*Attributes:*

<a id="CC_290f4a72000000000000000000000000"></a>__id: __A __p:ST_SlideId__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies the slide identifier.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SectionSlideIdListEntry">
2.   <xsd:attribute name="id" type="p:ST_SlideId" use="required"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c2e6338edcee4f62b70bfb7410ed8c03"></a><a id="_Toc174685931"></a>CT_ShowEventRecordList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[showEvtLst](#Section_04f39c957a484f98bb211f58fcd65e9d)

<a id="CC_add651b9000000000000000000000000"></a>A complex type that specifies a list of [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b) events that occurs during slide show.

*Child Elements:*

<a id="CC_80950a94000000000000000000000000"></a>__triggerEvt: __A __CT_TriggerEventRecord__ element (section [2.3.3.31](#Section_7169d50e01264777a072c615e9d9b489)) that specifies a triggered animation event.

<a id="CC_75d2c779000000000000000000000000"></a>__playEvt: __A __CT_MediaPlaybackEventRecord__ element (section [2.3.3.16](#Section_405a46f6e9da44baa6002b1eb59d07c8)) that specifies an event targeting a media object that starts playback.

<a id="CC_b4f80ebc000000000000000000000000"></a>__stopEvt: __A __CT_MediaPlaybackEventRecord__ element (section 2.3.3.16) that specifies an event targeting a media object that stops playback.

<a id="CC_39ea3297000000000000000000000000"></a>__pauseEvt: __A __CT_MediaPlaybackEventRecord__ element (section 2.3.3.16) that specifies an event targeting a media object that pauses playback.

<a id="CC_f2a63e53000000000000000000000000"></a>__resumeEvt: __A __CT_MediaPlaybackEventRecord__ element (section 2.3.3.16) that specifies an event targeting a media object that assumes playback.

<a id="CC_bac0106e000000000000000000000000"></a>__seekEvt: __A __CT_MediaSeekEventRecord__ element (section [2.3.3.17](#Section_23f1dc1973c64e7aa9ea11007f2a8821)) that specifies an event targeting a media object that seeks to a specified time in the media stream.

<a id="CC_ef2b76a6000000000000000000000000"></a>__nullEvt: __A __CT_NullEventRecord__ element (section [2.3.3.19](#Section_20d7137fba0a49e4b66967263a8161c3)) that specifies an unknown event.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ShowEventRecordList">
2.   <xsd:sequence>
3.     <xsd:choice minOccurs="0" maxOccurs="unbounded">
4.       <xsd:element name="triggerEvt" type="CT_TriggerEventRecord"/>
5.       <xsd:element name="playEvt" type="CT_MediaPlaybackEventRecord"/>
6.       <xsd:element name="stopEvt" type="CT_MediaPlaybackEventRecord"/>
7.       <xsd:element name="pauseEvt" type="CT_MediaPlaybackEventRecord"/>
8.       <xsd:element name="resumeEvt" type="CT_MediaPlaybackEventRecord"/>
9.       <xsd:element name="seekEvt" type="CT_MediaSeekEventRecord"/>
10.       <xsd:element name="nullEvt" type="CT_NullEventRecord"/>
11.     </xsd:choice>
12.   </xsd:sequence>
13. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c1300e6e2f43493c930a1b2f99cde7f3"></a><a id="_Toc174685932"></a>CT_ShowMediaControls

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[showMediaCtrls](#Section_39be05f1f23e4b20a825e710ca21e78c)

<a id="CC_f1be024c000000000000000000000000"></a>A complex type that specifies the visibility of media user interface controls during [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b). 

*Attributes:*

<a id="CC_da797b57000000000000000000000000"></a>__val: __An __xsd:boolean__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) that specifies the visibility of media user interface controls. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ShowMediaControls">
2.   <xsd:attribute name="val" type="xsd:boolean" use="required"/>
3. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c579b0ad29fc450ebea918d8190b0b44"></a><a id="_Toc174685933"></a>CT_ShredTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[shred](#Section_f431205506a24e4b81cb9aae921703ed)

<a id="CC_98d86703000000000000000000000000"></a>A complex type that specifies the parameters for a shred transition.

*Attributes:*

<a id="CC_acfab8a3000000000000000000000000"></a>__pattern: __An __ST_TransitionShredPattern__ attribute (section [2.3.4.5](#Section_af9e4ab58e0648719aeeedda326fe3de)) that specifies the shape of the visuals used during the transition.

<a id="CC_73eff61d000000000000000000000000"></a>__dir: __ A __p:ST_TransitionInOutDirectionType__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies the direction [__presentation slides__](#gt_18428521-9032-41a4-85c4-6fb65d882192) move during the transition. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ShredTransition">
2.   <xsd:attribute name="pattern" type="ST_TransitionShredPattern" use="optional" default="strip"/>
3.   <xsd:attribute name="dir" type="p:ST_TransitionInOutDirectionType" use="optional" default="in"/>
4. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7169d50e01264777a072c615e9d9b489"></a><a id="_Toc174685934"></a>CT_TriggerEventRecord

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

*Referenced by: *[CT_ShowEventRecordList](#Section_c2e6338edcee4f62b70bfb7410ed8c03)

<a id="CC_ce13f871000000000000000000000000"></a>A complex type that specifies a triggered event that occurs during [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b).

*Attributes:*

<a id="CC_7c5ee9eb000000000000000000000000"></a>__type: __A __p:ST_TLTriggerEvent__ attribute ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies the type of the triggered event.

<a id="CC_7c73e9db000000000000000000000000"></a>__time: __An __ST_UniversalTimeOffset__ attribute (section [2.3.4.6](#section_a3ead080d9cb4b4a80146d815248c23b)) that specifies the time that the event occurs. The value is relative to the beginning of the slide timeline, which does not include slide transition time.

<a id="CC_973ccdc8000000000000000000000000"></a>__objId: __An __a:ST_DrawingElementId__ attribute ([ISO/IEC29500-4:2016] section A.5.1) that specifies the identifier of the shape object on the slide that is the target of this event.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TriggerEventRecord">
2.   <xsd:attribute name="type" type="p:ST_TLTriggerEvent" use="required"/>
3.   <xsd:attribute name="time" type="p14:ST_UniversalTimeOffset" use="required"/>
4.   <xsd:attribute name="objId" type="a:ST_DrawingElementId" use="required"/>
5. </xsd:complexType>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
