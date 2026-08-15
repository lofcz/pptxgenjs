<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_4d8cd94fd5224f7d89e27bf0a7853781"></a><a id="_Toc174686168"></a>CT_Reaction

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/03/main

*Referenced by: *[CT_Reactions](#Section_55c6d5ff4a9a4d759859e160ca351d6c)

<a id="CC_be37ae4d000000000000000000000000"></a>A complex type that specifies information about a specific reaction type.

*Child Elements:*

<a id="CC_05dfc201000000000000000000000000"></a>__instance: __A [CT_ReactionInstance](#Section_ecc60fbd0a524f9dbb65c2dca088824d) element that specifies information about a user’s instance of a reaction.

*Attributes:*

<a id="CC_b5641f72000000000000000000000000"></a>__type: __A xsd:string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies the reaction type. This SHOULD correspond to a Unicode representation of an emoji.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_Reaction">
2.   <xsd:sequence>
3.     <xsd:element name="instance" type="CT_ReactionInstance" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="type" type="xsd:string" use="required"/>
6. </xsd:complexType>

See section [5.17](#Section_2f7f5f359fbd4210bfb8bf411b5d2dd5) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_ecc60fbd0a524f9dbb65c2dca088824d"></a><a id="_Toc174686169"></a>CT_ReactionInstance

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/03/main

*Referenced by: *[CT_Reaction](#Section_4d8cd94fd5224f7d89e27bf0a7853781)

<a id="CC_e22a032a000000000000000000000000"></a>A complex type that represents a reaction that a particular user has made.

*Child Elements:*

<a id="CC_067375e8000000000000000000000000"></a>__extLst: __A p:CT_ExtensionList ([[ISO/IEC-29500-4]](https://go.microsoft.com/fwlink/?LinkId=150884) section A.3) element that specifies the extension list. All future extensions to reaction instances will be stored in the extension list.

*Attributes:*

<a id="CC_2aec0aba000000000000000000000000"></a>__time: __A xsd:dateTime ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.7) attribute that specifies the time, in UTC, the instance was added.

<a id="CC_ea35e9cf000000000000000000000000"></a>__authorId: __An [ST_AuthorId](#Section_30fd68c67eb5479cacf773632431b459) attribute that specifies the author id of the user that reacted.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ReactionInstance">
2.   <xsd:sequence>
3.     <xsd:element name="extLst" type="p:CT_ExtensionList" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="time" type="xsd:dateTime" use="required"/>
6.   <xsd:attribute name="authorId" type="p188:ST_AuthorId" use="required"/>
7. </xsd:complexType>

See section [5.17](#Section_2f7f5f359fbd4210bfb8bf411b5d2dd5) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_55c6d5ff4a9a4d759859e160ca351d6c"></a><a id="_Toc174686170"></a>CT_Reactions

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2022/03/main

*Referenced by: *[reactions](#Section_5136a9d90e7c4e7a843f4304da0532a4)

<a id="CC_7f5b7b58000000000000000000000000"></a>A complex type that contains a sequence of reactions to the parent element where this extension is rooted.

*Child Elements:*

<a id="CC_c8b31b37000000000000000000000000"></a>__rxn: __A [CT_Reaction](#Section_4d8cd94fd5224f7d89e27bf0a7853781) element that specifies information about a specific reaction type.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_Reactions">
2.   <xsd:sequence>
3.     <xsd:element name="rxn" type="CT_Reaction" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.17](#Section_2f7f5f359fbd4210bfb8bf411b5d2dd5) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
