<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_7570e00a5f294d36bc303c23d19cbc53"></a><a id="_Toc174685953"></a>CT_ChartTrackingRefBased

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[chartTrackingRefBased](#Section_6c4aae64cf03408b9e5001666e6352f3)

<a id="CC_d37e99d6000000000000000000000000"></a>A complex type that specifies how data point properties and datalabels ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.2.1.2) in all charts ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 21.2) in this [__presentation__](#gt_a74c2f64-c512-41bc-9662-8168b2b0f5ae) behave.<a id="Appendix_A_Target_23"></a>[<23>](#Appendix_A_23" \o "Product behavior note 23)

*Attributes:*

<a id="CC_8c1284cc000000000000000000000000"></a>__val: __An __xsd:boolean__ ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies the behavior of data point properties and datalabels ([MS-ODRAWXML] section 2.2.1.2) in all charts ([ISO/IEC29500-1:2016] section 21.2) in this presentation as defined by the following table.

__Value__

__Meaning__

True

Datapoint properties and datalabels in all charts ([ISO/IEC29500-1:2016] section 21.2) in this presentation follow their reference.

False

Datapoint properties and datalabels in all charts ([ISO/IEC29500-1:2016] section 21.2) in this presentation follow their position in the chart.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ChartTrackingRefBased">
2.   <xsd:attribute name="val" type="xsd:boolean" use="required"/>
3. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_0bb9f3a2637d4068913fe5db40743a30"></a><a id="_Toc174685954"></a>CT_CommentThreading

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[threadingInfo](#Section_c9f006ddb1664699a3e6074ccbe441ca)

<a id="CC_d126a3f6000000000000000000000000"></a>A complex type that specifies threading extensions to the __CT_Comment__ complex type ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3).<a id="Appendix_A_Target_24"></a>[<24>](#Appendix_A_24" \o "Product behavior note 24)

*Child Elements:*

<a id="CC_983bc332000000000000000000000000"></a>__parentCm: __A __CT_ParentCommentIdentifier__ element (section [2.4.3.6](#Section_db7e896980af4891bc494d2111bfd82c)) that specifies the parent comment.

*Attributes:*

<a id="CC_9c6e3268000000000000000000000000"></a>__timeZoneBias: __An __xsd:int__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.17) that specifies the time zone bias, in minutes. The bias is the difference between [__Coordinated Universal Time (UTC)__](#gt_f2369991-a884-4843-a8fa-1505b6d5ece7) and time stored in the __dt__ attribute of the __CT_Comment__ complex type ([ISO/IEC29500-4:2016] section A.3). All translations between UTC and local time are based on the following formula: UTC = local time + bias

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentThreading">
2.   <xsd:sequence>
3.     <xsd:element name="parentCm" type="CT_ParentCommentIdentifier" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="timeZoneBias" type="xsd:int"/>
6. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_9ca7eff3ea7845479aafc18ca5e8319a"></a><a id="_Toc174685955"></a>CT_ExtendedGuide

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[CT_ExtendedGuideList](#Section_7023ef35b4a149fbb21cb32109895c8d)

<a id="CC_bf4793f3000000000000000000000000"></a>A complex type that specifies a guide within a presentation.<a id="Appendix_A_Target_25"></a>[<25>](#Appendix_A_25" \o "Product behavior note 25) Guides are lines used for arranging shapes and other content.

*Child Elements:*

<a id="CC_4aa4ef7a000000000000000000000000"></a>__clr: __A __CT_Color __element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.5.1) that specifies the color of the guide.

<a id="CC_62c9fa2b000000000000000000000000"></a>__extLst: __A __CT_ExtensionList__ element ([ISO/IEC29500-4:2016] section A.3) that specifies the extension list. All future extensions to the guide will be stored in the extension list.

*Attributes:*

<a id="CC_e200b81d000000000000000000000000"></a>__id: __An __xsd:unsignedInt __attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.22) that specifies a unique identifier for the guide. The identifier MUST be unique within its parent __CT_ExtendedGuideList __(section 2.4.3.4).

<a id="CC_553392be000000000000000000000000"></a>__name: __An __xsd:string __attribute ([XMLSCHEMA2/2] section 3.2.1) that specifies the name of the guide.

<a id="CC_3f9af3d7000000000000000000000000"></a>__orient: __An __ST_Direction__ attribute ([ISO/IEC29500-4:2016] section A.3) that specifies the orientation of the guide.

<a id="CC_afee9802000000000000000000000000"></a>__pos: __An __ST_Coordinate32__ attribute ([ISO/IEC29500-4:2016] section A.5.1) that specifies the position of the guide relative to the top or left side of the slide, in [__master units__](#gt_b70408ee-a21b-477f-afe9-e73c6fdb4bdb).

<a id="CC_1985cb61000000000000000000000000"></a>__userDrawn: __An __xsd:boolean__ ([XMLSCHEMA2/2] section 3.2.2) attribute that specifies whether the guide was inserted by the user.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ExtendedGuide">
2.   <xsd:sequence>
3.     <xsd:element name="clr" type="a:CT_Color" minOccurs="1" maxOccurs="1"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6.   <xsd:attribute name="id" type="xsd:unsignedInt" use="required"/>
7.   <xsd:attribute name="name" type="xsd:string" use="optional" default=""/>
8.   <xsd:attribute name="orient" type="p:ST_Direction" use="optional" default="vert"/>
9.   <xsd:attribute name="pos" type="a:ST_Coordinate32" use="optional" default="0"/>
10.   <xsd:attribute name="userDrawn" type="xsd:boolean" use="optional" default="false"/>
11. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7023ef35b4a149fbb21cb32109895c8d"></a><a id="_Toc174685956"></a>CT_ExtendedGuideList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[sldGuideLst](#Section_2b8e62b7e8e44795a7a6394c2295edaf), [notesGuideLst](#Section_6135012d23ec4278b5d20fa61b315531)

<a id="CC_d13df8cc000000000000000000000000"></a>A complex type that specifies a list of extended guides for a master slide, a slide layout, or a particular view of the presentation.<a id="Appendix_A_Target_26"></a>[<26>](#Appendix_A_26" \o "Product behavior note 26)

*Child Elements:*

<a id="CC_f48b8374000000000000000000000000"></a>__guide: __A __CT_ExtendedGuide__ element (section [2.4.3.3](#Section_9ca7eff3ea7845479aafc18ca5e8319a)) that specifies a guide in a presentation.

<a id="CC_bd2a7cbd000000000000000000000000"></a>__extLst: __A __CT_ExtensionList__ element ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) that specifies the extension list. All future extensions to the guide list will be stored in the extension list.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ExtendedGuideList">
2.   <xsd:sequence>
3.     <xsd:element name="guide" type="CT_ExtendedGuide" minOccurs="0" maxOccurs="unbounded"/>
4.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
5.   </xsd:sequence>
6. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_ce6eae7cfec041a797586adf67baf4c4"></a><a id="_Toc174685957"></a>CT_IsNarration

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[isNarration](#Section_4ae507ab2b3d41b094b2f59a1626023e)

<a id="CC_a548d200000000000000000000000000"></a>A complex type<a id="Appendix_A_Target_27"></a>[<27>](#Appendix_A_27" \o "Product behavior note 27) that specifies the narration flag for shapes. 

*Attributes:*

<a id="CC_5c1b5709000000000000000000000000"></a>__val: __A xsd:boolean ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies whether the shape is narration related. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_IsNarration">
2.   <xsd:attribute name="val" type="xsd:boolean" use="optional" default="false"/>
3. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_db7e896980af4891bc494d2111bfd82c"></a><a id="_Toc174685958"></a>CT_ParentCommentIdentifier

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[CT_CommentThreading](#Section_0bb9f3a2637d4068913fe5db40743a30)

<a id="CC_52521487000000000000000000000000"></a>A complex type that specifies the [__comment__](#gt_c8a897b9-522f-4b7a-8df6-40b65ac09f4d) author ID and comment index of the parent comment.<a id="Appendix_A_Target_28"></a>[<28>](#Appendix_A_28" \o "Product behavior note 28) Together, they identify the parent comment within a presentation.

*Attributes:*

<a id="CC_6eba97e9000000000000000000000000"></a>__authorId: __ An __xsd:unsignedInt__ attribute ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.22) that specifies the author of the parent comment by reference to the __authorId__ attribute contained within the __CT_Comment__ complex type ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3).

<a id="CC_8fe4b34d000000000000000000000000"></a>__idx: __An __xsd:unsignedInt__ attribute ([XMLSCHEMA2/2] section 3.3.22) that specifies the index of the parent comment by reference to the __idx__ attribute contained within the __CT_Comment__ complex type ([ISO/IEC29500-4:2016] section A.3).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ParentCommentIdentifier">
2.   <xsd:attribute name="authorId" type="xsd:unsignedInt"/>
3.   <xsd:attribute name="idx" type="xsd:unsignedInt"/>
4. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_04553ed32f834ec38e2ed41c46979e94"></a><a id="_Toc174685959"></a>CT_PresenceInfo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[presenceInfo](#Section_3afcb41c684947508e2d7db0e2375f32)

<a id="CC_75332852000000000000000000000000"></a>A complex type that specifies presence information extensions to the __CT_CommentAuthor__ complex type ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4).<a id="Appendix_A_Target_29"></a>[<29>](#Appendix_A_29" \o "Product behavior note 29)

*Attributes:*

<a id="CC_ce0d7234000000000000000000000000"></a>__userId: __An __xsd:string__ ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies a unique user id for a person.

<a id="CC_3befe69b000000000000000000000000"></a>__providerId: __An __xsd:string__ ([XMLSCHEMA2/2] section 3.2.1) attribute that specifies the identity provider that produced the subsequent userId attribute.

This table lists example data for these attributes.

Identity Provider

providerId

value

userId

value

Description of userId value

No Provider 

"None"

"Name"

Author’s name

Active Directory

"AD"

SID

Active Directory Security Identifier (as specified in [[MS-DTYP]](%5bMS-DTYP%5d.pdf#Section_cca2742956894a16b2b49325d93e4ba2) section [2.4.2](http://msdn.microsoft.com/en-us/library/78eb9013-1c3a-4970-ad1f-2b1dad588a25/))

Windows Live ID

"Windows Live"

CID

A 64-bit signed decimal that uniquely identifies a user on Windows Live.

Office 365<a id="Appendix_A_Target_30"></a>[<30>](#Appendix_A_30" \o "Product behavior note 30)

"AD"

O365ID

A string that uniquely identifies a user. It SHOULD<a id="Appendix_A_Target_31"></a>[<31>](#Appendix_A_31" \o "Product behavior note 31) be comprised of three individual values separated by a "::" character delimiter.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_PresenceInfo">
2.   <xsd:attribute name="userId" type="xsd:string" use="required"/>
3.   <xsd:attribute name="providerId" type="xsd:string" use="required"/>
4. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_56b22fd150b24a24ab9620a78cac7b06"></a><a id="_Toc174685960"></a>CT_PresetTransition

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2012/main

*Referenced by: *[prstTrans](#Section_e421e750ae5846c19c97dae93f6574e3)

<a id="CC_2bc4752f000000000000000000000000"></a>A complex type that specifies the parameters of a preset transition.

*Attributes:*

<a id="CC_57dac99a000000000000000000000000"></a>__prst: __An __xsd:string__ ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies the name of the preset transition. This name specifies the internal resource to use for the transition.

__prst Value__

__Meaning__

fallOver

A fall over transition as shown in the following figure.

*[figure omitted]*

<a id="_Ref334106066"></a>Figure 22: Sample with prst equal to "fallOver"

drape

A drape transition as shown in the following figure.

*[figure omitted]*

<a id="_Ref334106528"></a>Figure 23: Sample with prst equal to "drape"

curtains

A curtains transition as shown in the following figure.

*[figure omitted]*

Figure 24: Sample with prst equal to "curtains"

wind

A wind transition as shown in the following figure.

*[figure omitted]*

Figure 25: Sample with prst equal to "wind"

prestige

A prestige transition as shown in the following figure.

*[figure omitted]*

Figure 26: Sample with prst equal to "prestige"

fracture

A fracture transition as shown in the following figure.

*[figure omitted]*

Figure 27: Sample with prst equal to "fracture"

crush

A crush transition as shown in the following figure.

*[figure omitted]*

Figure 28: Sample with prst equal to "crush"

peelOff

A peel off transition as shown in the following figure.

*[figure omitted]*

Figure 29: Sample with prst equal to "peelOff"

pageCurlDouble

A double page curl transition as shown in the following figure.

*[figure omitted]*

Figure 30: Sample with prst equal to "pageCurlDouble"

pageCurlSingle

A single page curl transition as shown in the following figure.

*[figure omitted]*

Figure 31: Sample with prst equal to "pageCurlSingle"

airplane

An airplane transition as shown in the following figure.

*[figure omitted]*

Figure 32: Sample with prst equal to "airplane"

origami

An origami transition as shown in the following figure.

*[figure omitted]*

Figure 33: Sample with prst equal to "origami"

<a id="CC_2a669c22000000000000000000000000"></a>__invX: __An __xsd:boolean__ ([XMLSCHEMA2/2] section 3.2.2) attribute that specifies whether to invert the X coordinates of the transition. This can be used to make a left direction-based transition preset into a right direction-based transition.

<a id="CC_2a669c21000000000000000000000000"></a>__invY: __An __xsd:boolean__ ([XMLSCHEMA2/2] section 3.2.2) attribute that specifies whether to invert the Y coordinates of the transition. This can be used to make an up direction-based transition preset into a down direction-based transition preset.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_PresetTransition">
2.   <xsd:attribute name="prst" type="xsd:string"/>
3.   <xsd:attribute name="invX" type="xsd:boolean" use="optional" default="false"/>
4.   <xsd:attribute name="invY" type="xsd:boolean" use="optional" default="false"/>
5. </xsd:complexType>

See section [5.2](#Section_27d7324c0a294475a980de020defb315) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
