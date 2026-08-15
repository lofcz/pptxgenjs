<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_2af7e74f572b4e3f89484e5688bf84f3"></a><a id="_Toc174686090"></a>CT_ClassificationOutcome

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2018/4/main

*Referenced by: *[classification](#Section_6c6752260e114d0da8190f08d12d2059)

<a id="CC_00004301000000000000000000000000"></a>A complex type that specifies classification element extensions to the __CT_ApplicationNonVisualDrawingProps__ complex type ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.4).<a id="Appendix_A_Target_33"></a>[<33>](#Appendix_A_33" \o "Product behavior note 33)

*Attributes:*

<a id="CC_5fe5a54e000000000000000000000000"></a>__val: __An [ST_ClassificationOutcomeType](#Section_b87dffd5aca546f4b403d8cead97ba9f) attribute that specifies whether an element is a classification element.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ClassificationOutcome">
2.   <xsd:attribute name="val" type="ST_ClassificationOutcomeType"/>
3. </xsd:complexType>

See section [5.13](#Section_e34b98f194c043f7af1083a0c8a0a03b) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
