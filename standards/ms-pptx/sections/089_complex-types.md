<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_3a926e8de9e8414f8d3243eb1c06e8e9"></a><a id="_Toc174686033"></a>CT_ChangesInfo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[chgInfo](#Section_6eb2db2955b94a908e6167c644cc2398)

<a id="CC_0003e380000000000000000000000000"></a>A complex type that specifies metadata regarding the edits made to the document and the authors of those edits.

*Child Elements:*

<a id="CC_aa6090e3000000000000000000000000"></a>__docChgLst: __A [CT_DocumentChangesList](#Section_a941623fe7e64640914d5218e871520a) element that specifies metadata regarding the edits made to the document by a single user.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ChangesInfo">
2.   <xsd:sequence>
3.     <xsd:element name="docChgLst" type="CT_DocumentChangesList" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_0ffef3dc2d754541935f3241027c8b6c"></a><a id="_Toc174686034"></a>CT_CommentAuthorChanges

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_DocumentChanges](#Section_6a7a3a69769f40778b40698fe00b7c52)

<a id="CC_c1438856000000000000000000000000"></a>A complex type that specifies the edits made to a comment author object.

*Child Elements:*

<a id="CC_2256e409000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies the metadata common to content model change descriptors.

<a id="CC_65e71876000000000000000000000000"></a>__cmAuthorMkLst: __A [CT_CommentAuthorMonikerList](#Section_7e87d90d8bd6470a93a5fa94d6b292be) element that specifies a content moniker that identifies the edited comment author object.

<a id="CC_053ad061000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the comment author change descriptor will be stored in the extension list.

*Attributes:*

<a id="CC_1933196d000000000000000000000000"></a>__chg: __An [ST_CommentAuthorChangeBits](#Section_e372b4c65e934b0da12d589cbf478411) attribute that specifies the types of edits made to the comment author object.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentAuthorChanges">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="cmAuthorMkLst" type="CT_CommentAuthorMonikerList" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
6.   </xsd:sequence>
7.   <xsd:attribute name="chg" type="ST_CommentAuthorChangeBits" use="required"/>
8. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a412123da30a44609f91a8accb376d55"></a><a id="_Toc174686035"></a>CT_CommentAuthorMoniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

<a id="CC_4861bac1000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a comment author.

*Attributes:*

<a id="CC_e1a63b80000000000000000000000000"></a>__id: __An __xsd:unsignedInt__ ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.22) attribute that specifies the ID of the comment author (see the __id__ attribute in [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.4.2).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentAuthorMoniker">
2.   <xsd:attribute name="id" type="xsd:unsignedInt" use="required"/>
3. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_7e87d90d8bd6470a93a5fa94d6b292be"></a><a id="_Toc174686036"></a>CT_CommentAuthorMonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_CommentAuthorChanges](#Section_0ffef3dc2d754541935f3241027c8b6c), [cmAuthorMkLst](#Section_bd43cdc4ca92419098fa33f5a430771a)

<a id="CC_7bc8c8fb000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify a comment author in a document. The sequence of child elements MUST be a valid COMMENTAUTHORMONIKERLIST as specified in the following ABNF (specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)) grammar.

COMMENTAUTHORMONIKERLIST = DOCUMENTMONIKERLIST (section [2.12.3.11](#Section_ed04381212534f1290c33ce82d3f0d5b)) COMMENTAUTHORMONIKER

COMMENTAUTHORMONIKER = pc:cmAuthorMk (section [2.12.3.3](#Section_a412123da30a44609f91a8accb376d55))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentAuthorMonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_60f3f3c7c57e441a8680b090eb45eadd"></a><a id="_Toc174686037"></a>CT_CommentChanges

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_SlideChanges](#Section_f30be7c1cdf8464e860f86add89a5734)

<a id="CC_be52e786000000000000000000000000"></a>A complex type that specifies information about edits to a comment.

*Child Elements:*

<a id="CC_3f896b93000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies metadata common to content model changes.

<a id="CC_1fb1455a000000000000000000000000"></a>__cmMkLst: __A [CT_CommentMonikerList](#Section_d571c9fdc88a4e2dbdad2440a9037792) element that specifies a content moniker that identifies the edited comment. 

<a id="CC_e7330d7b000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the comment change descriptor will be stored in the extension list.

*Attributes:*

<a id="CC_ebf489a1000000000000000000000000"></a>__chg: __An [ST_CommentChangeBits](#Section_d2de8b819fa04f53bb4c5ee650be8459) attribute that specifies the types of edits made to the comment.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentChanges">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="cmMkLst" type="CT_CommentMonikerList" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
6.   </xsd:sequence>
7.   <xsd:attribute name="chg" type="ST_CommentChangeBits" use="required"/>
8. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_49325f153fa74f5fbeec2697037a5754"></a><a id="_Toc174686038"></a>CT_CommentMoniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

<a id="CC_e563e1e5000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a comment.

*Attributes:*

<a id="CC_effb10f3000000000000000000000000"></a>__authorId: __An __xsd:unsignedInt__ ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.3.22) attribute that specifies the author of the comment. It refers to the ID of an author in the comment author list for the document (see the __authorId__ attribute in [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.4.1).

<a id="CC_4b6fabd3000000000000000000000000"></a>__idx: __A __p:ST_Index__ ([ISO/IEC29500-1:2016] section 19.7.3) attribute that specifies the unique index of the comment (see the __idx__ attribute in [ISO/IEC29500-1:2016] section 19.4.1).

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentMoniker">
2.   <xsd:attribute name="authorId" type="xsd:unsignedInt" use="required"/>
3.   <xsd:attribute name="idx" type="p:ST_Index" use="required"/>
4. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_d571c9fdc88a4e2dbdad2440a9037792"></a><a id="_Toc174686039"></a>CT_CommentMonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_CommentChanges](#Section_60f3f3c7c57e441a8680b090eb45eadd), [cmMkLst](#Section_d620fd784d1945a1af6e2a90102ee2a8)

<a id="CC_c2766f55000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify a comment in a document. The sequence of child elements MUST be a valid COMMENTMONIKERLIST as specified in the following ABNF (specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)) grammar.

COMMENTMONIKERLIST = SLIDEMONIKERLIST (section [2.12.3.21](#Section_d50cf27ff9d4482b9c44076b2576ab75)) COMMENTMONIKER

COMMENTMONIKER = pc:cmMk (section [2.12.3.6](#Section_49325f153fa74f5fbeec2697037a5754))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentMonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_6a7a3a69769f40778b40698fe00b7c52"></a><a id="_Toc174686040"></a>CT_DocumentChanges

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_DocumentChangesList](#Section_a941623fe7e64640914d5218e871520a)

<a id="CC_7f3578a9000000000000000000000000"></a>A complex type that specifies metadata about edits to the [__presentation__](#gt_a74c2f64-c512-41bc-9662-8168b2b0f5ae) document.

*Child Elements:*

<a id="CC_df3d22a9000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies metadata common to content model changes.

<a id="CC_60416394000000000000000000000000"></a>__docMkLst: __A [CT_DocumentMonikerList](#Section_ed04381212534f1290c33ce82d3f0d5b) element that specifies a content moniker that identifies the edited document.

<a id="CC_18f5997c000000000000000000000000"></a>__sldChg: __A [CT_SlideChanges](#Section_f30be7c1cdf8464e860f86add89a5734) element that specifies the edits made to a slide in the document.

<a id="CC_64cb99bb000000000000000000000000"></a>__sldMasterChg: __A [CT_MainMasterChanges](#Section_43853e6e564a4b8ba10a4f95b065c242) element that specifies the edits made to a master slide in the document.

<a id="CC_cd8e2ec7000000000000000000000000"></a>__cmAuthorChg: __A [CT_CommentAuthorChanges](#Section_0ffef3dc2d754541935f3241027c8b6c) element that specifies the edits made to a comment author data object in the document.

<a id="CC_efc24e09000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the document change descriptor will be stored in the extension list.

*Attributes:*

<a id="CC_c2cea5a6000000000000000000000000"></a>__chg: __An [ST_DocumentChangeBits](#Section_a7336ccea9a0488ebfb852540c0bd624) attribute that specifies the types of edits made to the document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DocumentChanges">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="docMkLst" type="CT_DocumentMonikerList" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="sldChg" type="CT_SlideChanges" minOccurs="0" maxOccurs="unbounded"/>
6.     <xsd:element name="sldMasterChg" type="CT_MainMasterChanges" minOccurs="0" maxOccurs="unbounded"/>
7.     <xsd:element name="cmAuthorChg" type="CT_CommentAuthorChanges" minOccurs="0" maxOccurs="unbounded"/>
8.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
9.   </xsd:sequence>
10.   <xsd:attribute name="chg" type="ST_DocumentChangeBits" use="required"/>
11. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_a941623fe7e64640914d5218e871520a"></a><a id="_Toc174686041"></a>CT_DocumentChangesList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_ChangesInfo](#Section_3a926e8de9e8414f8d3243eb1c06e8e9)

<a id="CC_3d8c58ed000000000000000000000000"></a>A complex type that specifies metadata regarding the edits made to the document by a single user.

*Child Elements:*

<a id="CC_49f6c898000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies information about the user making the edits.

<a id="CC_46dfd02c000000000000000000000000"></a>__docChg: __A [CT_DocumentChanges](#Section_6a7a3a69769f40778b40698fe00b7c52) element that specifies metadata regarding a single edit to the document.

<a id="CC_e3e6d2c1000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the document changes list will be stored in the extension list.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DocumentChangesList">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="docChg" type="CT_DocumentChanges" minOccurs="0" maxOccurs="unbounded"/>
5.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
6.   </xsd:sequence>
7. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_226710f6e8b4414c92152cbc52c0558b"></a><a id="_Toc174686042"></a>CT_DocumentMoniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

<a id="CC_d9bbe87b000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a presentation document.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DocumentMoniker"/>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_ed04381212534f1290c33ce82d3f0d5b"></a><a id="_Toc174686043"></a>CT_DocumentMonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_DocumentChanges](#Section_6a7a3a69769f40778b40698fe00b7c52), [docMkLst](#Section_6be9be326f6642e5a699a8946a98ab17)

<a id="CC_131389ac000000000000000000000000"></a>A complex type that specifies a list of content monikers that together identify a presentation document. The sequence of child elements MUST be a valid DOCUMENTMONIKERLIST as specified in the following ABNF (specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)) grammar.

DOCUMENTMONIKERLIST = DOCUMENTMONIKER

DOCUMENTMONIKER = pc:docMk (section [2.12.3.10](#Section_226710f6e8b4414c92152cbc52c0558b))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_DocumentMonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_43853e6e564a4b8ba10a4f95b065c242"></a><a id="_Toc174686044"></a>CT_MainMasterChanges

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_DocumentChanges](#Section_6a7a3a69769f40778b40698fe00b7c52)

<a id="CC_f99f6e80000000000000000000000000"></a>A complex type that specifies metadata about edits to a master slide.

*Child Elements:*

<a id="CC_d56b3aed000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies metadata common to content model changes.

<a id="CC_fdff988a000000000000000000000000"></a>__sldMasterMkLst: __A [CT_MainMasterMonikerList](#Section_b5755c226f2248e3a773def01338004a) element that specifies a content moniker that identifies the edited master slide. 

<a id="CC_61ae4cd9000000000000000000000000"></a>__spChg: __An __ac:CT_ShapeChanges__ ([MS-ODRAWXML] section 2.29.3.16) element that specifies the edits made to a shape on the master slide. 

<a id="CC_b27c5109000000000000000000000000"></a>__grpChg: __An __ac:CT_GroupShapeChanges__ ([MS-ODRAWXML] section 2.29.3.7) element that specifies the edits made to a group shape on the master slide.

<a id="CC_f407e26e000000000000000000000000"></a>__graphicFrameChg: __An __ac:CT_GraphicFrameChanges__ ([MS-ODRAWXML] section 2.29.3.19) element that specifies the edits made to a graphic frame on the master slide.

<a id="CC_daada593000000000000000000000000"></a>__picChg: __An __ac:CT_PictureChanges__ ([MS-ODRAWXML] section 2.29.3.13) element that specifies the edits made to a picture on the master slide.

<a id="CC_9c1eba78000000000000000000000000"></a>__inkChg: __An __ac:CT_InkChanges__ ([MS-ODRAWXML] section 2.29.3.10) element that specifies the edits made to an ink object on the master slide.

<a id="CC_b3697ab3000000000000000000000000"></a>__cxnChg: __An __ac:CT_ConnectorChanges__ ([MS-ODRAWXML] section 2.29.3.2) element that specifies the edits made to a connector on the master slide.

<a id="CC_990ab568000000000000000000000000"></a>__sldLayoutChg: __A [CT_SlideLayoutChanges](#Section_35d5a88579f54ae2b5f32b8884286c44) element that specifies the edits made to a slide layout of the master slide.

<a id="CC_1ae656b2000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the master slide change descriptor will be stored in the extension list.

*Attributes:*

<a id="CC_ce1dc69b000000000000000000000000"></a>__chg: __An [ST_MainMasterChangeBits](#Section_20be4decb6784f9dac4106ac802f5b04) attribute that specifies the types of edits made to the master slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MainMasterChanges">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="sldMasterMkLst" type="CT_MainMasterMonikerList" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="spChg" type="ac:CT_ShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
6.     <xsd:element name="grpChg" type="ac:CT_GroupShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
7.     <xsd:element name="graphicFrameChg" type="ac:CT_GraphicFrameChanges" minOccurs="0" maxOccurs="unbounded"/>
8.     <xsd:element name="picChg" type="ac:CT_PictureChanges" minOccurs="0" maxOccurs="unbounded"/>
9.     <xsd:element name="inkChg" type="ac:CT_InkChanges" minOccurs="0" maxOccurs="unbounded"/>
10.     <xsd:element name="cxnChg" type="ac:CT_ConnectorChanges" minOccurs="0" maxOccurs="unbounded"/>
11.     <xsd:element name="sldLayoutChg" type="CT_SlideLayoutChanges" minOccurs="0" maxOccurs="unbounded"/>
12.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
13.   </xsd:sequence>
14.   <xsd:attribute name="chg" type="ST_MainMasterChangeBits" use="required"/>
15. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_303c23565a324aafa02b04c463768dd2"></a><a id="_Toc174686045"></a>CT_MainMasterMoniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

<a id="CC_3c6b26db000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a master slide.

*Attributes:*

<a id="CC_37451147000000000000000000000000"></a>__cId: __An [ST_CreationId](#Section_5f1ede0b7f9440f7949354ef37d2e36e) attribute that specifies the creation ID of the master slide (see section [2.3.1.4](#Section_82a107ddbeeb46468bd248f433e1d62e)).

<a id="CC_8d4da0f6000000000000000000000000"></a>__sldId: __A __p:ST_SlideMasterId__ ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.7.16) attribute that specifies the identifier of the master slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MainMasterMoniker">
2.   <xsd:attribute name="cId" type="ST_CreationId" use="optional"/>
3.   <xsd:attribute name="sldId" type="p:ST_SlideMasterId" use="required"/>
4. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_b5755c226f2248e3a773def01338004a"></a><a id="_Toc174686046"></a>CT_MainMasterMonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_MainMasterChanges](#Section_43853e6e564a4b8ba10a4f95b065c242), [sldMasterMkLst](#Section_f52fe394d2c348679b5051956df4aea2)

<a id="CC_1f5131bc000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify a master slide in a document. The sequence of child elements MUST be a valid MAINMASTERMONIKERLIST as specified in the following ABNF (specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)) grammar.

MAINMASTERMONIKERLIST = DOCUMENTMONIKERLIST (section [2.12.3.11](#Section_ed04381212534f1290c33ce82d3f0d5b)) MAINMASTERMONIKER 

MAINMASTERMONIKER = pc:sldMasterMk (section [2.12.3.13](#Section_303c23565a324aafa02b04c463768dd2))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_MainMasterMonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_58f4ec65823644719b13db325284e7d5"></a><a id="_Toc174686047"></a>CT_SlideBaseMonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[sldBaseMkLst](#Section_0027d133910242569b79864275f183fa)

<a id="CC_278bc4e1000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify an object in a document. The sequence of child elements MUST be a valid SLIDEBASEMONIKERLIST as specified in the following ABNF (specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)) grammar.

SLIDEBASEMONIKERLIST = MAINMASTERMONIKERLIST (section [2.12.3.14](#Section_b5755c226f2248e3a773def01338004a)) / SLIDELAYOUTMONIKERLIST (section [2.12.3.19](#Section_949bfaebf18f4dbda124624ff4b4ef83)) / SLIDEMONIKERLIST (section [2.12.3.21](#Section_d50cf27ff9d4482b9c44076b2576ab75))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideBaseMonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_f30be7c1cdf8464e860f86add89a5734"></a><a id="_Toc174686048"></a>CT_SlideChanges

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_DocumentChanges](#Section_6a7a3a69769f40778b40698fe00b7c52)

<a id="CC_11b6d82c000000000000000000000000"></a>A complex type that specifies information about edits to a slide.

*Child Elements:*

<a id="CC_5032396d000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies metadata common to content model changes.

<a id="CC_2553ad31000000000000000000000000"></a>__sldMkLst: __A [CT_SlideMonikerList](#Section_d50cf27ff9d4482b9c44076b2576ab75) element that specifies a content moniker that identifies the edited slide.

<a id="CC_b034ca23000000000000000000000000"></a>__spChg: __An __ac:CT_ShapeChanges__ ([MS-ODRAWXML] section 2.29.3.16) element that specifies the edits made to a shape on the slide.

<a id="CC_2c53e707000000000000000000000000"></a>__grpChg: __An __ac:CT_GroupShapeChanges__ ([MS-ODRAWXML] section 2.29.3.7) element that specifies the edits made to a group shape on the slide.

<a id="CC_f3027343000000000000000000000000"></a>__graphicFrameChg: __An __ac:CT_GraphicFrameChanges__ ([MS-ODRAWXML] section 2.29.3.19) element that specifies the edits made to a graphic frame on the slide.

<a id="CC_c1f173ee000000000000000000000000"></a>__picChg: __An __ac:CT_PictureChanges__ ([MS-ODRAWXML] section 2.29.3.13) element that specifies the edits made to a picture on the slide.

<a id="CC_8d2c6bf3000000000000000000000000"></a>__inkChg: __An __ac:CT_InkChanges__ ([MS-ODRAWXML] section 2.29.3.10) element that specifies the edits made to an ink object on the slide.

<a id="CC_7308d4d9000000000000000000000000"></a>__cxnChg: __An __ac:CT_ConnectorChanges__ ([MS-ODRAWXML] section 2.29.3.2) element that specifies the edits made to a connector on the slide.

<a id="CC_cb0e6c52000000000000000000000000"></a>__cmChg: __A [CT_CommentChanges](#Section_60f3f3c7c57e441a8680b090eb45eadd) element that specifies the edits made to a comment on the slide.

<a id="CC_84eec0b5000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the slide change descriptor will be stored in the extension list

*Attributes:*

<a id="CC_2d6d5757000000000000000000000000"></a>__chg: __An [ST_SlideChangeBits](#Section_1e0f8fda550244c2910b98e7cc5be149) attribute that specifies the types of edits made to the slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideChanges">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="sldMkLst" type="CT_SlideMonikerList" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="spChg" type="ac:CT_ShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
6.     <xsd:element name="grpChg" type="ac:CT_GroupShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
7.     <xsd:element name="graphicFrameChg" type="ac:CT_GraphicFrameChanges" minOccurs="0" maxOccurs="unbounded"/>
8.     <xsd:element name="picChg" type="ac:CT_PictureChanges" minOccurs="0" maxOccurs="unbounded"/>
9.     <xsd:element name="inkChg" type="ac:CT_InkChanges" minOccurs="0" maxOccurs="unbounded"/>
10.     <xsd:element name="cxnChg" type="ac:CT_ConnectorChanges" minOccurs="0" maxOccurs="unbounded"/>
11.     <xsd:element name="cmChg" type="CT_CommentChanges" minOccurs="0" maxOccurs="unbounded"/>
12.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
13.   </xsd:sequence>
14.   <xsd:attribute name="chg" type="ST_SlideChangeBits" use="required"/>
15. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_35d5a88579f54ae2b5f32b8884286c44"></a><a id="_Toc174686049"></a>CT_SlideLayoutChanges

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_MainMasterChanges](#Section_43853e6e564a4b8ba10a4f95b065c242)

<a id="CC_5af76ba4000000000000000000000000"></a>A complex type that specifies the metadata about edits to a slide layout.

*Child Elements:*

<a id="CC_806e53fd000000000000000000000000"></a>__chgData: __An __ac:CT_ChangesData__ ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.29.3.1) element that specifies metadata common to content model changes.

<a id="CC_b42e2292000000000000000000000000"></a>__sldLayoutMkLst: __A [CT_SlideLayoutMonikerList](#Section_949bfaebf18f4dbda124624ff4b4ef83) element that specifies a content moniker that identifies the edited slide layout. 

<a id="CC_5541482d000000000000000000000000"></a>__spChg: __An __ac:CT_ShapeChanges__ ([MS-ODRAWXML] section 2.29.3.16) element that specifies the edits made to a shape on the slide layout.

<a id="CC_113ac85f000000000000000000000000"></a>__grpChg: __An __ac:CT_GroupShapeChanges__ ([MS-ODRAWXML] section 2.29.3.7) element that specifies the edits made to a group shape on the slide layout.

<a id="CC_e5a23aea000000000000000000000000"></a>__graphicFrameChg: __An __ac:CT_GraphicFrameChanges__ ([MS-ODRAWXML] section 2.29.3.19) element that specifies the edits made to a graphic frame on the slide layout. 

<a id="CC_6af2c8ca000000000000000000000000"></a>__picChg: __An __ac:CT_PictureChanges__ ([MS-ODRAWXML] section 2.29.3.13) element that specifies the edits made to a picture on the slide layout. 

<a id="CC_a0a7c8eb000000000000000000000000"></a>__inkChg: __An __ac:CT_InkChanges__ ([MS-ODRAWXML] section 2.29.3.10) element that specifies the edits made to an ink object on the slide layout. 

<a id="CC_f3a0c699000000000000000000000000"></a>__cxnChg: __An __ac:CT_ConnectorChanges__ ([MS-ODRAWXML] section 2.29.3.2) element that specifies the edits made to a connector on the slide layout. 

<a id="CC_f597f6e5000000000000000000000000"></a>__extLst: __A __p:CT_ExtensionList__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.3) element that specifies the extension list. All future extensions to the slide layout change descriptor will be stored in the extension list. 

*Attributes:*

<a id="CC_2ddd76fb000000000000000000000000"></a>__chg: __An [ST_SlideLayoutChangeBits](#Section_c54bc9dd74564451ace43e49778fcbb6) attribute that specifies the types of edits made to the slide layout. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideLayoutChanges">
2.   <xsd:sequence>
3.     <xsd:element name="chgData" type="ac:CT_ChangesData" minOccurs="0" maxOccurs="1"/>
4.     <xsd:element name="sldLayoutMkLst" type="CT_SlideLayoutMonikerList" minOccurs="1" maxOccurs="1"/>
5.     <xsd:element name="spChg" type="ac:CT_ShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
6.     <xsd:element name="grpChg" type="ac:CT_GroupShapeChanges" minOccurs="0" maxOccurs="unbounded"/>
7.     <xsd:element name="graphicFrameChg" type="ac:CT_GraphicFrameChanges" minOccurs="0" maxOccurs="unbounded"/>
8.     <xsd:element name="picChg" type="ac:CT_PictureChanges" minOccurs="0" maxOccurs="unbounded"/>
9.     <xsd:element name="inkChg" type="ac:CT_InkChanges" minOccurs="0" maxOccurs="unbounded"/>
10.     <xsd:element name="cxnChg" type="ac:CT_ConnectorChanges" minOccurs="0" maxOccurs="unbounded"/>
11.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
12.   </xsd:sequence>
13.   <xsd:attribute name="chg" type="ST_SlideLayoutChangeBits" use="required"/>
14. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_43403201bae74d5bbcbde2b0d6a3b08a"></a><a id="_Toc174686050"></a>CT_SlideLayoutMoniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

<a id="CC_a70999dc000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a slide layout.

*Attributes:*

<a id="CC_bc9d3bee000000000000000000000000"></a>__cId: __An [ST_CreationId](#Section_5f1ede0b7f9440f7949354ef37d2e36e) attribute that specifies the creation ID of the slide layout (see section [2.3.1.4](#Section_82a107ddbeeb46468bd248f433e1d62e)).

<a id="CC_5097169e000000000000000000000000"></a>__sldId: __A __p:ST_SlideLayoutId__ ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.7.14) attribute that specifies the identifier of the slide layout.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideLayoutMoniker">
2.   <xsd:attribute name="cId" type="ST_CreationId" use="optional"/>
3.   <xsd:attribute name="sldId" type="p:ST_SlideLayoutId" use="required"/>
4. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_949bfaebf18f4dbda124624ff4b4ef83"></a><a id="_Toc174686051"></a>CT_SlideLayoutMonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_SlideLayoutChanges](#Section_35d5a88579f54ae2b5f32b8884286c44), [sldLayoutMkLst](#Section_f8db812bbd464108b4ac43be4b38d7c5)

<a id="CC_01889162000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify a slide layout in a document. The sequence of child elements MUST be a valid SLIDELAYOUTMONIKERLIST as specified in the following ABNF (specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)) grammar.

SLIDELAYOUTMONIKERLIST = MAINMASTERMONIKERLIST (section [2.12.3.14](#Section_b5755c226f2248e3a773def01338004a)) SLIDELAYOUTMONIKER 

SLIDELAYOUTMONIKER = pc:sldLayoutMk (section [2.12.3.18](#Section_43403201bae74d5bbcbde2b0d6a3b08a))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideLayoutMonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_856b398e1b9946c7aba1d26043ba7968"></a><a id="_Toc174686052"></a>CT_SlideMoniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

<a id="CC_390a401e000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a slide.

*Attributes:*

<a id="CC_29cbcf2f000000000000000000000000"></a>__cId: __An [ST_CreationId](#Section_5f1ede0b7f9440f7949354ef37d2e36e) attribute that specifies the creation ID of the slide (see section [2.3.1.4](#Section_82a107ddbeeb46468bd248f433e1d62e)). 

<a id="CC_21aa0367000000000000000000000000"></a>__sldId: __A __p:ST_SlideId__ ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4) attribute that specifies the identifier of the slide.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideMoniker">
2.   <xsd:attribute name="cId" type="ST_CreationId" use="optional"/>
3.   <xsd:attribute name="sldId" type="p:ST_SlideId" use="required"/>
4. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_d50cf27ff9d4482b9c44076b2576ab75"></a><a id="_Toc174686053"></a>CT_SlideMonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2013/main/command

*Referenced by: *[CT_SlideChanges](#Section_f30be7c1cdf8464e860f86add89a5734), [sldMkLst](#Section_d0abca56c6b74df8bfd3def71f2d61d9), [CT_Comment](#Section_161bc2c998fc46b7852bba7ee77e2e54)

<a id="CC_400ae2fb000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify a slide in a document. The sequence of child elements MUST be a valid SLIDEMONIKERLIST as specified in the following ABNF (specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)) grammar.

SLIDEMONIKERLIST = DOCUMENTMONIKERLIST (section [2.12.3.11](#Section_ed04381212534f1290c33ce82d3f0d5b)) SLIDEMONIKER 

SLIDEMONIKER = pc:sldMk (section [2.12.3.20](#Section_856b398e1b9946c7aba1d26043ba7968))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_SlideMonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.3](#Section_cf9393f7a14445e6b7d55dec18fcfce0) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
