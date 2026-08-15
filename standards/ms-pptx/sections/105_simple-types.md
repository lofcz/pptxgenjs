<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_b87dffd5aca546f4b403d8cead97ba9f"></a><a id="_Toc174686092"></a>ST_ClassificationOutcomeType

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/4/main

*Referenced by: *[CT_ClassificationOutcome](#Section_2af7e74f572b4e3f89484e5688bf84f3)

<a id="CC_87eda20f000000000000000000000000"></a>A simple type specifying the content classification outcome type.

Value

Meaning

none

<a id="CC_b6fad7ee000000000000000000000000"></a>No classification outcome.

hdr

<a id="CC_7c684f34000000000000000000000000"></a>Header classification outcome.

ftr

<a id="CC_7c784f2a000000000000000000000000"></a>Footer classification outcome.

watermark

<a id="CC_09cbe4d2000000000000000000000000"></a>Watermark classification outcome.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_ClassificationOutcomeType">
2.   <xsd:restriction base="xsd:token">
3.     <xsd:enumeration value="none"/>
4.     <xsd:enumeration value="hdr"/>
5.     <xsd:enumeration value="ftr"/>
6.     <xsd:enumeration value="watermark"/>
7.   </xsd:restriction>
8. </xsd:simpleType>

See section [5.13](#Section_e34b98f194c043f7af1083a0c8a0a03b) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
