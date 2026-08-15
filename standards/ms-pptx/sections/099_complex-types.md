<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_6e6f991a57a242989599969a766d09d9"></a><a id="_Toc174686083"></a>CT_ReadonlyRecommended

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2017/10/main

*Referenced by: *[readonlyRecommended](#Section_0891d9737290493a9cb29aa20ccf73dc)

<a id="CC_62e94e1e000000000000000000000000"></a>A complex type that specifies whether the document is opened as read-only with the option to edit.

*Attributes:*

<a id="CC_82b0ffa6000000000000000000000000"></a>__val: __A xsd:boolean ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.2) attribute that specifies whether the document is opened in read-only with the option to edit.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_ReadonlyRecommended">
2.   <xsd:attribute name="val" type="xsd:boolean" use="required"/>
3. </xsd:complexType>

See section [5.11](#Section_28180d300176416fbaf72212d5dd0c48) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
