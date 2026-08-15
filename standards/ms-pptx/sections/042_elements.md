<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Elements -->

### Elements


#### <a id="section_7a7c9c0b9ceb4cac909fbd57f052c863"></a><a id="_Toc174685864"></a>bmkTgt

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_e3564ede000000000000000000000000"></a>A __CT_MediaBookmarkTarget__ element (section [2.3.3.13](#Section_f27090527a54446e94c3fa0bced8c775)) that specifies a media bookmark that triggers an animation. See section [2.2.2](#Section_3dae7e98e8ea426598e041146b9eb838) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="bmkTgt" type="CT_MediaBookmarkTarget"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_f500c032002b44b884fcada145d84bf3"></a><a id="_Toc174685865"></a>browseMode

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_82f64f77000000000000000000000000"></a>A __CT_BrowseMode__ element (section [2.3.3.1](#Section_aea110ba98b34216971bb8b996375f0b)) that specifies the status bar visibility when [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b) is in browse mode. See section [2.2.6](#Section_fc79996c7c154f4b80654f672dd70414) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="browseMode" type="CT_BrowseMode"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_e0aeee44571e49c8a753e7a8dd2026bb"></a><a id="_Toc174685866"></a>conveyor

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_be5fd3f9000000000000000000000000"></a>A __CT_LeftRightDirectionTransition__ element (section [2.3.3.10](#Section_56ea32ef98ad4bfbb57220a99c86c4d8)) that specifies a conveyor transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following is a sample with __dir__ equal to "l" (left):

*[figure omitted]*

Figure 1: Sample conveyor transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="conveyor" type="CT_LeftRightDirectionTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_82a107ddbeeb46468bd248f433e1d62e"></a><a id="_Toc174685867"></a>creationId

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_2f0e6a70000000000000000000000000"></a>A __CT_RandomId__ element (section [2.3.3.21](#Section_853d9ddb5e614bc78e073e3d05f27e2c)) that specifies an identifier that is generated when a slide is created. See section [2.2.9](#Section_6c8bd1b8ffc14198ba1dd52828544d6a) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065). 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="creationId" type="CT_RandomId"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_28952ea67e824ce787a9d76f9ed0fa91"></a><a id="_Toc174685868"></a>defaultImageDpi

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_8d61ed5f000000000000000000000000"></a>A __CT_DefaultImageDpi__ element (section [2.3.3.3](#Section_5099194613ca4ee48efb20d8f4770a17)) that specifies the resolution, in dots per inch (dpi), to use when saving images in the document. This element value is used only when the __autoCompressPictures__ attribute ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.2.1.26) is set to __true__, and the __useLocalDpi__ element ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.3.1.13) is set to __false__. See section [2.2.7](#Section_3c206095ec1d44a8a21d77796c03d59e) for how this element integrates with [ISO/IEC29500-1:2016].

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="defaultImageDpi" type="CT_DefaultImageDpi"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_ec51c8866e0f4fa183a6a33ca3cea0aa"></a><a id="_Toc174685869"></a>discardImageEditData

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_5b6c8386000000000000000000000000"></a>A __CT_DiscardImageEditData__ element (section [2.3.3.4](#Section_adc484a16e66459ba53b74ff23ad806c)) that specifies that all __imgProps__ elements ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.3.1.9) and cropped out areas of images are not to be saved. See section [2.2.7](#Section_3c206095ec1d44a8a21d77796c03d59e) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="discardImageEditData" type="CT_DiscardImageEditData"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_71791754bdce43d18bf4eaeccc85d4aa"></a><a id="_Toc174685870"></a>doors

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_816b7940000000000000000000000000"></a>A __p:CT_OrientationTransition__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies a doors transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following is a sample with __dir__ equal to "vert" (vertical):

*[figure omitted]*

Figure 2: Sample doors transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="doors" type="p:CT_OrientationTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_1097f03f66b94fcb8d2248004fbfb9d3"></a><a id="_Toc174685871"></a>extLst

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_16c977cd000000000000000000000000"></a>A __p:CT_ExtensionListModify__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies the extension list with modification ability. All future extensions to the __contentPart__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.14) will be stored within this extension list. See section [2.2.3](#Section_a05ae034990f44748c975c70bb0a9862) for how this element integrates with [ISO/IEC29500-1:2016].

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="extLst" type="p:CT_ExtensionListModify"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_e326a2fa25bd43a490f2f0356d5f6405"></a><a id="_Toc174685872"></a>ferris

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_cfb675ea000000000000000000000000"></a>A __CT_LeftRightDirectionTransition__ element (section [2.3.3.10](#Section_56ea32ef98ad4bfbb57220a99c86c4d8)) that specifies a ferris transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following is a sample with __dir__ equal to "l" (left):

*[figure omitted]*

Figure 3: Sample ferris transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="ferris" type="CT_LeftRightDirectionTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_67b6b598da79400893f051c45e520057"></a><a id="_Toc174685873"></a>flash

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_b45a93cf000000000000000000000000"></a>A __p:CT_Empty__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies a flash transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample:

*[figure omitted]*

Figure 4: Sample flash transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="flash" type="p:CT_Empty"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_02b192a9284c40e5aa3ca89c5f6f66cc"></a><a id="_Toc174685874"></a>flip

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_737aa0eb000000000000000000000000"></a>A __CT_LeftRightDirectionTransition__ element (section [2.3.3.10](#Section_56ea32ef98ad4bfbb57220a99c86c4d8)) that specifies a flip transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample with __dir__ equal to "r" (right).

*[figure omitted]*

Figure 5: Sample flip transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="flip" type="CT_LeftRightDirectionTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_71a951a17d6d45779b032fb84632deb2"></a><a id="_Toc174685875"></a>flythrough

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_4309c55a000000000000000000000000"></a>A __CT_FlyThroughTransition__ element (section [2.3.3.5](#Section_9cb735d9285e41ea9303c0ed13bd9931)) that specifies a fly through transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065). 

The following figure is a sample with __dir__ equal to "in", __hasBounce__ equal to __false__:

*[figure omitted]*

Figure 6: Sample flythrough transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="flythrough" type="CT_FlyThroughTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7e9eb7c83945419bb3787672b6133425"></a><a id="_Toc174685876"></a>gallery

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_688adf9c000000000000000000000000"></a>A __CT_LeftRightDirectionTransition__ element (section [2.3.3.10](#Section_56ea32ef98ad4bfbb57220a99c86c4d8)) that specifies a gallery transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065). 

The following figure is a sample with __dir__ equal to "l" (left).

*[figure omitted]*

Figure 7: Sample gallery transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="gallery" type="CT_LeftRightDirectionTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c78988eeb178452392176d18df30f674"></a><a id="_Toc174685877"></a>glitter

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_a13eaf5d000000000000000000000000"></a>A __CT_GlitterTransition__ element (section [2.3.3.6](#Section_93a73ee56799478f8c1f3db23726e10e)) that specifies a glitter transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following is a sample with __dir__ equal to "l" (left), __pattern__ equal to "diamond":

*[figure omitted]*

Figure 8: Sample glitter transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="glitter" type="CT_GlitterTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_e32665f497154c94a28528bff8ef8684"></a><a id="_Toc174685878"></a>honeycomb

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_aef4af92000000000000000000000000"></a>A __p:CT_Empty__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies a honeycomb transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample:

*[figure omitted]*

Figure 9: Sample honeycomb transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="honeycomb" type="p:CT_Empty"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_0210cac3a5ca49959a93184eba887711"></a><a id="_Toc174685879"></a>laserClr

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_5b2d6efd000000000000000000000000"></a>An __a:CT_Color__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the color to be used to render the laser dot. See section [2.2.6](#Section_fc79996c7c154f4b80654f672dd70414) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="laserClr" type="a:CT_Color"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a0466c2453384edc920a3d095aa8738a"></a><a id="_Toc174685880"></a>laserTraceLst

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_c1e6d477000000000000000000000000"></a>A __CT_LaserTraceList__ element (section [2.3.3.8](#Section_b35b724f590b480ab5b772e97735c2b2)) that specifies a list of laser traces on the [__presentation slide__](#gt_18428521-9032-41a4-85c4-6fb65d882192). See section [2.2.6](#Section_fc79996c7c154f4b80654f672dd70414) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="laserTraceLst" type="CT_LaserTraceList"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_3d88e290a4a94db29457b04687c06cf5"></a><a id="_Toc174685881"></a>media

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_9a4de423000000000000000000000000"></a>A __CT_Media__ element (section [2.3.3.14](#Section_f8b7e1cb976e4f388139f9e5ffa826e8)) that specifies a media object. See section [2.2.4](#Section_a504076c0bb24aebb268f380b71a74d0) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="media" type="CT_Media"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c7f10e508b6f42e09926e1d15f6a4861"></a><a id="_Toc174685882"></a>modId

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_be6eefc1000000000000000000000000"></a>A __CT_RandomId__ element (section [2.3.3.21](#Section_853d9ddb5e614bc78e073e3d05f27e2c)) that specifies an identifier that is updated each time a [__shape__](#gt_d0e38aa4-2c71-4a6f-b5e6-75766fa9409e) is modified. Each identifier specified MUST be unique to the [__presentation slide__](#gt_18428521-9032-41a4-85c4-6fb65d882192) that contains it. See section [2.2.9](#Section_6c8bd1b8ffc14198ba1dd52828544d6a) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="modId" type="CT_RandomId"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_160202ae324149c8aad23f8e5e043602"></a><a id="_Toc174685883"></a>nvContentPartPr

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_597fa685000000000000000000000000"></a>A __CT_ContentPartNonVisual__ element (section [2.3.3.2](#Section_bda997a4aa4142aa9c09512c7e4fc5bc)) that specifies the non-visual drawing properties for a __contentPart__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.14). These non-visual properties are properties that the generating application uses when rendering and editing the content part. See section [2.2.3](#Section_a05ae034990f44748c975c70bb0a9862) for how this element integrates with [ISO/IEC29500-1:2016].

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="nvContentPartPr" type="CT_ContentPartNonVisual"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_801f9e80bbcc414581d3fee8c75a0f1e"></a><a id="_Toc174685884"></a>pan

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_106b0124000000000000000000000000"></a>A __p:CT_SideDirectionTransition__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies a pan transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065). 

The following figure is a sample with __dir__ equal to "u" (up).

*[figure omitted]*

Figure 10: Sample pan transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="pan" type="p:CT_SideDirectionTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_52f75e750b724e82ab576474229e751c"></a><a id="_Toc174685885"></a>prism

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_a20c5471000000000000000000000000"></a>A __CT_PrismTransition__ element (section [2.3.3.20](#Section_79f003b6811b4225a0f630a3b58d663d)) that specifies a prism transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample with __dir__ equal to "l" (left), __isContent__ equal to __false__, __isInverted__ equal to __false__:

*[figure omitted]*

Figure 11: Sample prism transition 1

The following figure is a sample with __dir__ equal to "r" (right), __isContent__ equal to __false__, __isInverted__ equal to __true__:

*[figure omitted]*

Figure 12: Sample prism transition 2

The following figure is a sample with __dir__ equal to "u" (up), __isContent__ equal to __true__, __isInverted__ equal to __false__:

*[figure omitted]*

Figure 13: Sample prism transition 3

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="prism" type="CT_PrismTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_830962fcea324de9b0c5ba5e2a8a9bb3"></a><a id="_Toc174685886"></a>reveal

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_c2832b4b000000000000000000000000"></a>A __CT_RevealTransition__ element (section [2.3.3.22](#Section_eb6d865240724c1f957f548ee3ab1584)) that specifies a reveal transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following is a sample with __thruBlk__ equal to __true__, __dir__ equal to "l" (left):

*[figure omitted]*

Figure 14: Sample reveal transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="reveal" type="CT_RevealTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_c1c9b4f579c04e2f8b59db2b4cee9f00"></a><a id="_Toc174685887"></a>ripple

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_7424794b000000000000000000000000"></a>A __CT_RippleTransition__ element (section [2.3.3.23](#Section_053cdddd5f304beda1ff67e7b5759dd3)) that specifies a ripple transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample with __dir__ equal to "center".

*[figure omitted]*

Figure 15: Sample ripple transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="ripple" type="CT_RippleTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_db88eca9e5d04fc6b1c95387557998bd"></a><a id="_Toc174685888"></a>sectionLst

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_b9d8aa5d000000000000000000000000"></a>A __CT_SectionList__ element (section [2.3.3.25](#Section_b499c39b7c504a5888e6f86e6046be50)) that specifies section properties for the document. See section [2.2.5](#Section_1f21a089944d410bbd474f5e692c2532) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="sectionLst" type="CT_SectionList"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_04f39c957a484f98bb211f58fcd65e9d"></a><a id="_Toc174685889"></a>showEvtLst

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_d58d66d9000000000000000000000000"></a>A __CT_ShowEventRecordList__ element (section [2.3.3.28](#Section_c2e6338edcee4f62b70bfb7410ed8c03)) that specifies a list of [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b) events that occur during slide show. See section [2.2.6](#Section_fc79996c7c154f4b80654f672dd70414) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="showEvtLst" type="CT_ShowEventRecordList"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_39be05f1f23e4b20a825e710ca21e78c"></a><a id="_Toc174685890"></a>showMediaCtrls

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_cc809975000000000000000000000000"></a>A __CT_ShowMediaControls__ element (section [2.3.3.29](#Section_c1300e6e2f43493c930a1b2f99cde7f3)) that specifies the visibility of media user interface controls during [__slide show__](#gt_340561a9-dc0c-42ad-ab6f-7b6d854d3c1b). See section [2.2.4](#Section_a504076c0bb24aebb268f380b71a74d0) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="showMediaCtrls" type="CT_ShowMediaControls"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_f431205506a24e4b81cb9aae921703ed"></a><a id="_Toc174685891"></a>shred

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_911ea58d000000000000000000000000"></a>A __CT_ShredTransition__ element (section [2.3.3.30](#Section_c579b0ad29fc450ebea918d8190b0b44)) that specifies a shred transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample with __pattern__ equal to "strip", __dir__ equal to "in":

*[figure omitted]*

Figure 16: Sample shred transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="shred" type="CT_ShredTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_3da05579946146e2a1c732fe2092bba6"></a><a id="_Toc174685892"></a>switch

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_2ff0ffc2000000000000000000000000"></a>A __CT_LeftRightDirectionTransition__ element (section [2.3.3.10](#Section_56ea32ef98ad4bfbb57220a99c86c4d8)) that specifies a switch transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample with __dir__ equal to "r" (right):

*[figure omitted]*

Figure 17: Sample switch transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="switch" type="CT_LeftRightDirectionTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_b12536eae4454d658733be64b70d121f"></a><a id="_Toc174685893"></a>vortex

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_9e596e81000000000000000000000000"></a>A __p:CT_SideDirectionTransition__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies a vortex transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample with __dir__ equal to "r" (right):

*[figure omitted]*

Figure 18: Sample vortex transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="vortex" type="p:CT_SideDirectionTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a3a8b0c3573b403399c46e535ee759f4"></a><a id="_Toc174685894"></a>warp

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_02a9d1a6000000000000000000000000"></a>A __p:CT_InOutTransition__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) that specifies a warp transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following is a sample with __dir__ equal to "in":

*[figure omitted]*

Figure 19: Sample warp transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="warp" type="p:CT_InOutTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_762237347aa74053b666acd5f73d1d9a"></a><a id="_Toc174685895"></a>wheelReverse

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_2ad81e78000000000000000000000000"></a>A __p:CT_WheelTransition__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies a reverse wheel transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following figure is a sample with __spokes__ equal to 1.

*[figure omitted]*

Figure 20: Sample wheelReverse transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="wheelReverse" type="p:CT_WheelTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_de20045ad22048b2a3975d37c916d662"></a><a id="_Toc174685896"></a>window

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_9d0a5e71000000000000000000000000"></a>A __p:CT_OrientationTransition__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) that specifies a window transition. See section [2.2.1](#Section_22ebe6b52ade43d9977a98fa194725c2) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following is a sample with __dir__ equal to "vert" (vertical):

*[figure omitted]*

Figure 21: Sample window transition

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="window" type="p:CT_OrientationTransition"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_5ec5c2162cbb417ab7b7b367b1ec06c2"></a><a id="_Toc174685897"></a>xfrm

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2010/main

<a id="CC_42ce0745000000000000000000000000"></a>An __a:CT_Transform2D__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the 2-D transform for a content part. See section [2.2.3](#Section_a05ae034990f44748c975c70bb0a9862) for how this element integrates with [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this element.

1. <xsd:element name="xfrm" type="a:CT_Transform2D"/>

See section [5.1](#Section_cc91572885a446a0a07ceb5416a5762e) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
