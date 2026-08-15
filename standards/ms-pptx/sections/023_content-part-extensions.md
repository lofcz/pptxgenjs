<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Content Part Extensions -->

### Content Part Extensions


The __grpSp__ element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.22) is extended by the addition of an __AlternateContent __child element ([[ISO/IEC29500-3:2015]](https://go.microsoft.com/fwlink/?linkid=861154) section 7.5), whose structure is specified in the following table.

AlternateContent components

Child element

Choice: http://schemas.microsoft.com/office/powerpoint/2010/main

__contentPart __([ISO/IEC29500-1:2016] section 19.3.1.14)

Fallback

__sp __([ISO/IEC29500-1:2016] section 19.3.1.43)

The __contentPart __element ([ISO/IEC29500-1:2016] section 19.3.1.14) is extended by the addition of the following child elements to a new __xsd:sequence __content model of the __CT_Rel__ complex type ([ISO/IEC29500-1:2016] section A.3):

- __nvContentPartPr__ (section [2.3.1.20](#Section_160202ae324149c8aad23f8e5e043602))
- __xfrm__ (section [2.3.1.34](#Section_5ec5c2162cbb417ab7b7b367b1ec06c2))
- __extLst__ (section [2.3.1.8](#Section_1097f03f66b94fcb8d2248004fbfb9d3)).

The __contentPart __element ([ISO/IEC29500-1:2016] section 19.3.1.14) is further extended by the addition of the following attribute to the __CT_Rel__ complex type ([ISO/IEC29500-1:2016] section A.3): __bwMode __(section [2.3.2.2](#Section_057a6a2bbcef42578cefaf99a2eca7ea)).

#### <a id="section_0a7df81ab34d48468e1fdb55b34f696b"></a><a id="_Toc174685843"></a>Ink Extensions

The spTree element ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 19.3.1.45) and the grpSp element ([ISO/IEC29500-1:2016] section 19.3.1.22) are extended by the addition of an AlternateContent child element<a id="Appendix_A_Target_1"></a>[<1>](#Appendix_A_1" \o "Product behavior note 1) whose structure is specified in the following table.

AlternateContent components

Child element  

Choice:

http://schemas.microsoft.com/office/powerpoint/2010/main

http://schemas.microsoft.com/office/powerpoint/2014/inkAction ([[MS-ODRAWXML]](%5bMS-ODRAWXML%5d.pdf#Section_06cff208c6e14db7bb68665135e5f0de) section 2.21)

contentPart ([ISO/IEC29500-1:2016]

section 19.3.1.14)

Fallback

pic ([ISO/IEC29500-1:2016] section 

19.3.1.37)
