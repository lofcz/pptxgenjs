<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_1e14abdf5b784ca19f11123500cc875a"></a><a id="_Toc174686129"></a>CT_CommentReplyV2Moniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2019/9/main/command

<a id="CC_05b3a175000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a comment reply.

*Attributes:*

<a id="CC_e4c457d4000000000000000000000000"></a>__id: __A s:ST_Guid ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.8.9) attribute that specifies a uniquely generated ID to identify the comment reply.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentReplyV2Moniker">
2.   <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
3. </xsd:complexType>

See section [5.15](#Section_03d8f774bc534111820cafdd3ab2753a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_3cf43a62498b407eb6ea2c3243203c8a"></a><a id="_Toc174686130"></a>CT_CommentReplyV2MonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2019/9/main/command

*Referenced by: *[cmRplyMkLst](#Section_b9d7005bb49848d5a4028f0b05c85b9c), [CT_CommentReplyV2Changes](#Section_786f0b374aae44aebb81f7e785b8c09e)

<a id="CC_99eea530000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify a comment reply in a document. The sequence of child elements MUST be a valid COMMENTREPLYV2MONIKERLIST as shown in the following ABNF grammar (as specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)).  

COMMENTREPLYV2MONIKERLIST = COMMENTV2MONIKERLIST (section [2.18.3.4](#Section_6ae762ceb7044b75a574ea562ce0579a)) COMMENTREPLYV2MONIKER

COMMENTREPLYV2MONIKER = __pc2:cmRplyMk__ (section [2.18.3.1](#Section_1e14abdf5b784ca19f11123500cc875a))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentReplyV2MonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.15](#Section_03d8f774bc534111820cafdd3ab2753a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_2b5a1ab2d5fe45829a9fa6b72bff81cf"></a><a id="_Toc174686131"></a>CT_CommentV2Moniker

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2019/9/main/command

<a id="CC_343952b6000000000000000000000000"></a>A complex type that specifies the content moniker information associated with a comment.

*Attributes:*

<a id="CC_a5eae9af000000000000000000000000"></a>__id: __A s:ST_Guid ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.8.9) attribute that specifies a uniquely generated ID to identify the comment.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentV2Moniker">
2.   <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
3. </xsd:complexType>

See section [5.15](#Section_03d8f774bc534111820cafdd3ab2753a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_6ae762ceb7044b75a574ea562ce0579a"></a><a id="_Toc174686132"></a>CT_CommentV2MonikerList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2019/9/main/command

*Referenced by: *[cmMkLst](#Section_274144916b9f41d1935ca27d4134f014), [CT_CommentV2Changes](#Section_824ea50e3cc444249549e64c4dcb576e)

<a id="CC_90938493000000000000000000000000"></a>A complex type that specifies a list of content monikers that together uniquely identify a comment in a document. The sequence of child elements MUST be a valid COMMENTV2MONIKERLIST as specified in the shown in the following ABNF grammar (as specified in [[RFC5234]](https://go.microsoft.com/fwlink/?LinkId=123096)).

COMMENTV2MONIKERLIST = SLIDEMONIKERLIST (section [2.12.3.21](#Section_d50cf27ff9d4482b9c44076b2576ab75)) COMMENTV2MONIKER

COMMENTV2MONIKER = pc2:cmMK (section [2.18.3.3](#Section_2b5a1ab2d5fe45829a9fa6b72bff81cf))

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_CommentV2MonikerList">
2.   <xsd:sequence>
3.     <xsd:any minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.15](#Section_03d8f774bc534111820cafdd3ab2753a) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
