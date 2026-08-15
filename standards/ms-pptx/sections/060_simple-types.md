<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_22e711ee35a742cbb87c1c277ec11070"></a><a id="_Toc174685976"></a>ST_TransitionMorphOption

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2015/09/main

*Referenced by: *[CT_MorphTransition](#Section_41ca8fbfefc849ac8a327bd0856544bd)

<a id="CC_f41fef1b000000000000000000000000"></a>A simple type that specifies the level of detail for matching objects on the slide.

Value

Meaning

byObject

<a id="CC_fb01d6cb000000000000000000000000"></a>Sets the Objects effect option, where objects are matched and moved.

byWord

<a id="CC_dabe5f3d000000000000000000000000"></a>Sets the Words effect option, where objects as well as individual words are matched and moved.

byChar

<a id="CC_33a2d670000000000000000000000000"></a>Sets the Characters effect option, where objects as well as individual characters are matched and moved.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_TransitionMorphOption">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="byObject"/>
4.     <xsd:enumeration value="byWord"/>
5.     <xsd:enumeration value="byChar"/>
6.   </xsd:restriction>
7. </xsd:simpleType>

See section [5.4](#Section_a54fd7b704d64d16bbddb20b2b99578c) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
