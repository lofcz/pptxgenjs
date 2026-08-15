<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Author Part -->

### Author Part


The following table specifies a new Author part that can be stored in a PresentationML document.

Part Components

Value

Content type

application/vnd.ms-powerpoint.authors+xml

Root namespace

http://schemas.microsoft.com/office/powerpoint/2018/8/main

Source relationship

http://schemas.microsoft.com/office/2018/10/relationships/authors

An instance of an Author part specifies a set of authors included by a PresentationML document.

A package __MUST__ contain zero or one Author part. If it exists, that part __MUST__ be the target of an implicit relationship from the Presentation part ([ISO/IEC29500-1:2016] section 13.3.6).

The root element for a part of this content type MUST be __authorLst __(section [2.16.1.1](#Section_8df7f6eda77c4be9968233a696291737)).

An Author part MUST be located within the package containing the relationships part (expressed syntactically, the __TargetMode__ attribute of the __Relationship__ element ([[ISO/IEC29500-2:2012]](https://go.microsoft.com/fwlink/?LinkID=330448) section 6.5.3.4) MUST be Internal.

An Author part MUST NOT have implicit or explicit relationships to other parts specified in [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) or this document
