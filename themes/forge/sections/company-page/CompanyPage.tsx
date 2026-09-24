import React, { useEffect, useRef } from 'react'

import styled from '@emotion/styled'

import type {
  ImageValue,
  SectionComponentProps,
} from '#themes/shared/types/theme'

type PageKind =
  | 'home'
  | 'about'
  | 'capabilities'
  | 'industries'
  | 'projects'
  | 'sustainability'
  | 'insights'
  | 'article'
  | 'careers'
  | 'contact'
interface PageSettings {
  page?: PageKind
  eyebrow?: string
  title?: string
  intro?: string
  image?: string | ImageValue
}

const images = {
  factory:
    'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=88',
  worker:
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1800&q=88',
  sparks:
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=1800&q=88',
  engineer:
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1800&q=88',
  steel:
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1800&q=88',
}
const pageUrl = (template: string) =>
  `/preview?theme=forge&template=${template}`

const Page = styled.div`
  background: var(--forge-bone);
`
const Section = styled.section`
  width: min(100%, var(--forge-page-width));
  margin: 0 auto;
  padding: var(--forge-section-space) var(--forge-gutter-desktop);
  @media (max-width: 767px) {
    width: 100%;
    padding: var(--forge-section-space-mobile) var(--forge-gutter-mobile);
  }
`
const DarkSection = styled(Section)`
  width: calc(100% - 16px);
  border-radius: var(--forge-card-radius);
  background: var(--forge-ink);
  color: var(--forge-paper);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
`
const Reveal = styled.div`
  opacity: 0;
  transform: translateY(54px);
  filter: blur(7px);
  transition:
    transform 900ms var(--forge-ease),
    opacity 900ms var(--forge-ease),
    filter 900ms var(--forge-ease);
  &.is-visible {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`
const Eyebrow = styled.p`
  display: inline-flex;
  margin: 0 0 24px;
  padding: 6px 11px;
  border-radius: var(--forge-pill-radius);
  background: rgba(23, 25, 21, 0.06);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.2em;
  text-transform: uppercase;
`
const Display = styled.h1`
  max-width: var(--forge-content-width);
  margin: 0;
  font: 520 clamp(58px, 9.6vw, 146px)/0.84 var(--forge-heading);
  letter-spacing: -0.078em;
  text-wrap: balance;
  @media (max-width: 767px) {
    font-size: clamp(52px, 17vw, 76px);
    line-height: 0.88;
  }
`
const H2 = styled.h2`
  max-width: var(--forge-content-width);
  margin: 0;
  font: 520 clamp(42px, 6.1vw, 88px)/0.93 var(--forge-heading);
  letter-spacing: -0.065em;
  text-wrap: balance;
`
const Intro = styled.p`
  max-width: 620px;
  margin: 34px 0 0 auto;
  color: #50534c;
  font-size: clamp(17px, 1.7vw, 22px);
  line-height: 1.55;
  letter-spacing: -0.02em;
  @media (max-width: 767px) {
    margin-left: 0;
  }
`
const DarkIntro = styled(Intro)`
  color: rgba(244, 241, 233, 0.62);
`
const Hero = styled(Section)`
  min-height: 100dvh;
  padding-top: clamp(154px, 17vw, 232px);
  padding-bottom: 34px;
`
const HeroMediaShell = styled.div`
  margin-top: clamp(58px, 8vw, 112px);
  padding: 7px;
  border-radius: 34px;
  background: rgba(23, 25, 21, 0.07);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.05);
`
const HeroMedia = styled.div<{ image: string }>`
  position: relative;
  min-height: min(68vw, 760px);
  overflow: hidden;
  border-radius: 28px;
  background: #353831 url(${({ image }) => image}) center / cover no-repeat;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);

  &::after {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      120deg,
      rgba(10, 12, 10, 0.58),
      transparent 55%
    );
    content: '';
  }
  @media (max-width: 767px) {
    min-height: 560px;
  }
`
const MediaStamp = styled.div`
  position: absolute;
  z-index: 1;
  right: 28px;
  bottom: 26px;
  display: grid;
  width: 104px;
  height: 104px;
  place-items: center;
  border-radius: 50%;
  background: var(--forge-orange);
  color: var(--forge-ink);
  text-align: center;
  font-size: 9px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  @media (max-width: 767px) {
    right: 16px;
    bottom: 16px;
    width: 86px;
    height: 86px;
  }
`
const Metrics = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 0.75fr 0.75fr;
  gap: var(--forge-grid-gap);
  margin-top: 8px;
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`
const MetricShell = styled.div`
  padding: 6px;
  border-radius: 26px;
  background: rgba(23, 25, 21, 0.06);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.045);
`
const Metric = styled.div<{ accent?: boolean }>`
  min-height: 210px;
  padding: 27px;
  border-radius: 21px;
  background: ${({ accent }) =>
    accent ? 'var(--forge-orange)' : 'var(--forge-paper)'};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.74);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  strong {
    font: 540 clamp(54px, 7vw, 94px)/0.9 var(--forge-heading);
    letter-spacing: -0.07em;
  }
  span {
    max-width: 220px;
    color: ${({ accent }) => (accent ? 'rgba(23,25,21,.7)' : '#676a63')};
    font-size: 12px;
  }
`
const Bento = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--forge-grid-gap);
  margin-top: 64px;
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`
const CardShell = styled.div<{ span?: number }>`
  grid-column: span ${({ span }) => span || 4};
  padding: 6px;
  border-radius: var(--forge-card-radius);
  background: rgba(23, 25, 21, 0.055);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.045);
  @media (max-width: 767px) {
    grid-column: 1;
  }
`
const Card = styled.article<{ dark?: boolean }>`
  min-height: 340px;
  padding: 30px;
  border-radius: var(--forge-media-radius);
  background: ${({ dark }) => (dark ? 'var(--forge-ink)' : 'var(--forge-paper)')};
  color: ${({ dark }) => (dark ? 'var(--forge-paper)' : 'var(--forge-ink)')};
  box-shadow: inset 0 1px 0
    ${({ dark }) => (dark ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.8)')};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 750ms var(--forge-ease);
  &:hover {
    transform: translateY(-5px);
  }
  small {
    color: ${({ dark }) => (dark ? 'var(--forge-orange)' : '#75786f')};
    font-size: 10px;
    font-weight: 750;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  h3 {
    max-width: 520px;
    margin: 40px 0 14px;
    font: 540 clamp(30px, 3.8vw, 54px)/0.96 var(--forge-heading);
    letter-spacing: -0.055em;
  }
  p {
    max-width: 480px;
    margin: 0;
    color: ${({ dark }) => (dark ? 'rgba(244,241,233,.55)' : '#686b64')};
    font-size: 13px;
  }
`
const ArrowLink = styled.a`
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 13px;
  margin-top: 28px;
  padding: 6px 7px 6px 18px;
  border-radius: var(--forge-button-radius);
  background: var(--forge-ink);
  color: var(--forge-paper);
  text-decoration: none;
  font-size: 12px;
  font-weight: 700;
  transition: transform 650ms var(--forge-ease);
  span {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border-radius: 50%;
    background: var(--forge-orange);
    color: var(--forge-ink);
    transition: transform 650ms var(--forge-ease);
  }
  &:hover span {
    transform: translate(3px, -1px) scale(1.05);
  }
  &:active {
    transform: scale(0.98);
  }
`
const Split = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(300px, 0.92fr);
  gap: clamp(44px, 9vw, 140px);
  align-items: start;
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`
const List = styled.div`
  > div,
  > a {
    display: grid;
    grid-template-columns: 48px 1fr auto;
    gap: 20px;
    align-items: start;
    padding: 24px 0;
    color: inherit;
    text-decoration: none;
    box-shadow: inset 0 1px rgba(23, 25, 21, 0.1);
    transition:
      transform 650ms var(--forge-ease),
      opacity 650ms var(--forge-ease);
  }
  > a:hover {
    transform: translateX(8px);
  }
  small {
    color: #7b7e76;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
  }
  strong {
    font: 520 clamp(23px, 2.5vw, 34px)/1.1 var(--forge-heading);
    letter-spacing: -0.045em;
  }
  p {
    grid-column: 2 / -1;
    max-width: 560px;
    margin: 0;
    color: #676a63;
    font-size: 13px;
  }
`
const ImageCard = styled.div<{ image: string }>`
  min-height: 640px;
  border-radius: 25px;
  background: #3c3f38 url(${({ image }) => image}) center / cover;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  @media (max-width: 767px) {
    min-height: 440px;
  }
`
const Quote = styled.blockquote`
  max-width: 1060px;
  margin: 0;
  font: 500 clamp(38px, 6vw, 82px)/1 var(--forge-heading);
  letter-spacing: -0.06em;
  em {
    color: var(--forge-orange);
    font-style: normal;
  }
`
const ArticleGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: clamp(42px, 9vw, 130px);
  @media (max-width: 767px) {
    grid-template-columns: 1fr;
  }
`
const ArticleBody = styled.article`
  max-width: 760px;
  font-size: clamp(17px, 1.5vw, 20px);
  line-height: 1.8;
  color: #44473f;
  h2 {
    margin: 80px 0 24px;
    color: var(--forge-ink);
    font: 540 clamp(34px, 4vw, 54px)/1 var(--forge-heading);
    letter-spacing: -0.055em;
  }
  p {
    margin: 0 0 28px;
  }
  blockquote {
    margin: 64px 0;
    padding: 30px 0;
    box-shadow:
      inset 0 1px var(--forge-orange),
      inset 0 -1px var(--forge-orange);
    color: var(--forge-ink);
    font: 520 clamp(28px, 3vw, 42px)/1.1 var(--forge-heading);
    letter-spacing: -0.04em;
  }
`
const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 7px;
  border-radius: var(--forge-card-radius);
  background: rgba(23, 25, 21, 0.06);
  box-shadow: inset 0 0 0 1px rgba(23, 25, 21, 0.045);
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
  label {
    display: flex;
    min-height: 92px;
    flex-direction: column;
    gap: 8px;
    padding: 18px 20px;
    border-radius: 22px;
    background: var(--forge-paper);
    color: #777a72;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
  label:last-of-type {
    grid-column: 1/-1;
    min-height: 180px;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--forge-ink);
    font-size: 15px;
    resize: none;
  }
  button {
    grid-column: 1/-1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 9px 8px 22px;
    border: 0;
    border-radius: var(--forge-button-radius);
    background: var(--forge-ink);
    color: var(--forge-paper);
    cursor: pointer;
    font-weight: 700;
    transition: transform 650ms var(--forge-ease);
  }
  button span {
    display: grid;
    width: 42px;
    height: 42px;
    place-items: center;
    border-radius: 50%;
    background: var(--forge-orange);
    color: var(--forge-ink);
    transition: transform 650ms var(--forge-ease);
  }
  button:hover span {
    transform: translate(3px, -1px) scale(1.05);
  }
  button:active {
    transform: scale(0.98);
  }
`

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const nodes = ref.current?.querySelectorAll('[data-reveal]')
    if (!nodes) return
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return
    }
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.12 },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
  return ref
}

const StandardHero = ({
  settings,
  fallbackImage = images.factory,
}: {
  settings: PageSettings
  fallbackImage?: string
}) => {
  const image =
    typeof settings.image === 'string' ? settings.image : settings.image?.url
  return (
    <Hero>
      <Reveal data-reveal>
        <Display>{settings.title}</Display>
        <Intro>{settings.intro}</Intro>
      </Reveal>
      <Reveal data-reveal>
        <HeroMediaShell>
          <HeroMedia image={image || fallbackImage}>
            <MediaStamp>
              Made to
              <br />
              endure
              <br />↘
            </MediaStamp>
          </HeroMedia>
        </HeroMediaShell>
      </Reveal>
    </Hero>
  )
}

const capabilities = [
  [
    '01',
    'Precision fabrication',
    'Five-axis machining, robotic welding and complex metalwork held to microscopic tolerances.',
  ],
  [
    '02',
    'Systems integration',
    'Mechanical, electrical and control systems assembled, tested and commissioned as one.',
  ],
  [
    '03',
    'Industrial automation',
    'Purpose-built production cells that improve repeatability, throughput and operator safety.',
  ],
  [
    '04',
    'Quality assurance',
    'Traceable inspection from incoming material through final dimensional and performance validation.',
  ],
]
const articles = [
  [
    'Engineering',
    '08 min',
    'Designing production resilience into every cell',
    'How modular thinking and digital commissioning reduce risk before equipment reaches the factory floor.',
  ],
  [
    'Perspective',
    '05 min',
    'The real cost of a one-millimetre deviation',
    'Precision is not a specification at the end. It is a culture built into every handoff.',
  ],
  [
    'Sustainability',
    '07 min',
    'Less scrap, more intelligence',
    'What closed-loop material planning means for modern fabrication.',
  ],
]

const HomePage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} />
      <Section>
        <Reveal data-reveal>
          <Eyebrow>Scale / measured</Eyebrow>
          <H2>Industrial capability, human accountability.</H2>
        </Reveal>
        <Metrics>
          {[
            ['38', 'years of engineering craft'],
            ['0.01', 'mm verified tolerance'],
            ['17', 'markets delivered'],
          ].map(([value, label], index) => (
            <MetricShell key={label}>
              <Metric accent={index === 0}>
                <strong>{value}</strong>
                <span>{label}</span>
              </Metric>
            </MetricShell>
          ))}
        </Metrics>
      </Section>
      <DarkSection>
        <Reveal data-reveal>
          <Eyebrow>What we make</Eyebrow>
          <H2>One partner, from first drawing to factory floor.</H2>
        </Reveal>
        <Bento>
          {capabilities.slice(0, 3).map((item, index) => (
            <CardShell
              span={index === 0 ? 7 : index === 1 ? 5 : 12}
              key={item[0]}
            >
              <Card dark>
                <small>{item[0]} / Capability</small>
                <div>
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </div>
              </Card>
            </CardShell>
          ))}
        </Bento>
        <ArrowLink href={pageUrl('capabilities')}>
          Explore capabilities <span>↗</span>
        </ArrowLink>
      </DarkSection>
      <Section>
        <Reveal data-reveal>
          <Quote>
            We make the critical parts behind <em>everyday momentum.</em>
          </Quote>
        </Reveal>
      </Section>
    </>
  )
}

const AboutPage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.worker} />
      <Section>
        <Split>
          <Reveal data-reveal>
            <Eyebrow>Our principle</Eyebrow>
            <H2>Capability earns attention. Consistency earns trust.</H2>
          </Reveal>
          <Reveal data-reveal>
            <Intro>
              Atlas began as a twelve-person machine shop in 1987. Today, more
              than 620 specialists work across design, fabrication, automation
              and quality. The scale changed. The standard never did.
            </Intro>
          </Reveal>
        </Split>
      </Section>
      <DarkSection>
        <Reveal data-reveal>
          <Eyebrow>Milestones</Eyebrow>
        </Reveal>
        <List>
          {[
            ['1987', 'First workshop opens in Bandung'],
            ['2004', 'Integrated engineering campus commissioned'],
            ['2016', 'Robotic fabrication line enters service'],
            ['2026', 'Third carbon-neutral production hall opens'],
          ].map((x, i) => (
            <Reveal data-reveal key={x[0]}>
              <div>
                <small>0{i + 1}</small>
                <strong>{x[0]}</strong>
                <p>{x[1]}</p>
              </div>
            </Reveal>
          ))}
        </List>
      </DarkSection>
      <Section>
        <Reveal data-reveal>
          <Eyebrow>How we work</Eyebrow>
          <H2>Clear thinking. Clean handoffs. No hidden compromises.</H2>
        </Reveal>
        <Bento>
          {[
            [
              'Own the outcome',
              'Every team stays accountable beyond its individual scope.',
            ],
            [
              'Make it legible',
              'Good engineering should be understood, tested and maintained.',
            ],
            [
              'Improve the system',
              'Every project leaves the process stronger than it found it.',
            ],
          ].map((x, i) => (
            <CardShell span={i === 0 ? 6 : 3} key={x[0]}>
              <Card>
                <small>Principle / 0{i + 1}</small>
                <div>
                  <h3>{x[0]}</h3>
                  <p>{x[1]}</p>
                </div>
              </Card>
            </CardShell>
          ))}
        </Bento>
      </Section>
    </>
  )
}

const CapabilitiesPage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.sparks} />
      <Section>
        <Reveal data-reveal>
          <Eyebrow>Integrated scope</Eyebrow>
          <H2>Fewer handoffs. Better control.</H2>
        </Reveal>
        <Bento>
          {capabilities.map((item, index) => (
            <CardShell span={index % 3 === 0 ? 7 : 5} key={item[0]}>
              <Card dark={index === 0 || index === 3}>
                <small>{item[0]} / Discipline</small>
                <div>
                  <h3>{item[1]}</h3>
                  <p>{item[2]}</p>
                </div>
              </Card>
            </CardShell>
          ))}
        </Bento>
      </Section>
      <DarkSection>
        <Split>
          <Reveal data-reveal>
            <Eyebrow>Production system</Eyebrow>
            <H2>From prototype to repeatable volume.</H2>
          </Reveal>
          <List>
            {[
              'Design for manufacture',
              'Prototype and validation',
              'Tooling and process planning',
              'Serial production',
              'Lifecycle support',
            ].map((x, i) => (
              <div key={x}>
                <small>0{i + 1}</small>
                <strong>{x}</strong>
                <span>↘</span>
              </div>
            ))}
          </List>
        </Split>
      </DarkSection>
    </>
  )
}

const IndustriesPage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.engineer} />
      <Section>
        <Split>
          <Reveal data-reveal>
            <div>
              <Eyebrow>Sectors</Eyebrow>
              <H2>Deep context for high-consequence work.</H2>
              <Intro>
                Our teams understand the regulation, operating environments and
                production realities behind every brief.
              </Intro>
            </div>
          </Reveal>
          <List>
            {[
              ['Mobility', 'Structures, tooling and automated assembly'],
              ['Energy', 'Enclosures, skids and balance-of-plant systems'],
              ['Food & beverage', 'Hygienic process equipment and conveyors'],
              [
                'Built environment',
                'Architectural metalwork and infrastructure',
              ],
              ['Industrial technology', 'OEM systems and precision components'],
            ].map((x, i) => (
              <a href={pageUrl('contact')} key={x[0]}>
                <small>0{i + 1}</small>
                <strong>{x[0]}</strong>
                <span>↗</span>
                <p>{x[1]}</p>
              </a>
            ))}
          </List>
        </Split>
      </Section>
    </>
  )
}

const ProjectsPage = ({ settings }: { settings: PageSettings }) => {
  const projects = [
    ['EV battery module line', 'Mobility / Indonesia', images.factory],
    ['Turbine service platform', 'Energy / Singapore', images.steel],
    ['High-speed packaging cell', 'FMCG / Malaysia', images.worker],
  ]
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.steel} />
      <Section>
        <Reveal data-reveal>
          <Eyebrow>Selected work</Eyebrow>
          <H2>Proof, at production scale.</H2>
        </Reveal>
        <Bento>
          {projects.map((p, i) => (
            <CardShell span={i === 0 ? 7 : i === 1 ? 5 : 12} key={p[0]}>
              <Card>
                <ImageCard image={p[2]} />
                <div>
                  <small>{p[1]}</small>
                  <h3>{p[0]}</h3>
                </div>
              </Card>
            </CardShell>
          ))}
        </Bento>
      </Section>
    </>
  )
}

const SustainabilityPage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.factory} />
      <DarkSection>
        <Reveal data-reveal>
          <Eyebrow>2026 targets</Eyebrow>
          <H2>Less material. Less energy. More value from both.</H2>
        </Reveal>
        <Metrics>
          {[
            ['−42%', 'operational carbon since 2019'],
            ['96%', 'metal scrap recovered'],
            ['31%', 'renewable electricity'],
          ].map((x, index) => (
            <MetricShell key={x[1]}>
              <Metric accent={index === 0}>
                <strong>{x[0]}</strong>
                <span>{x[1]}</span>
              </Metric>
            </MetricShell>
          ))}
        </Metrics>
      </DarkSection>
      <Section>
        <Split>
          <Reveal data-reveal>
            <Eyebrow>Our approach</Eyebrow>
            <H2>Designed into the process, not reported after it.</H2>
          </Reveal>
          <List>
            {[
              'Material efficiency from first nest',
              'Closed-loop coolant and water systems',
              'Equipment designed for repair',
              'Supplier emissions in project decisions',
            ].map((x, i) => (
              <div key={x}>
                <small>0{i + 1}</small>
                <strong>{x}</strong>
                <span>↘</span>
              </div>
            ))}
          </List>
        </Split>
      </Section>
    </>
  )
}

const InsightsPage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.engineer} />
      <Section>
        <Reveal data-reveal>
          <Eyebrow>Latest thinking</Eyebrow>
          <H2>Notes from the factory floor.</H2>
        </Reveal>
        <Bento>
          {articles.map((a, i) => (
            <CardShell span={i === 0 ? 7 : i === 1 ? 5 : 12} key={a[2]}>
              <Card dark={i === 0}>
                <small>
                  {a[0]} / {a[1]}
                </small>
                <div>
                  <h3>{a[2]}</h3>
                  <p>{a[3]}</p>
                  <ArrowLink href={pageUrl('article')}>
                    Read article <span>↗</span>
                  </ArrowLink>
                </div>
              </Card>
            </CardShell>
          ))}
        </Bento>
      </Section>
    </>
  )
}

const ArticlePage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.engineer} />
      <Section>
        <ArticleGrid>
          <aside>
            <Eyebrow>Field note / 018</Eyebrow>
            <p>
              By Raka Santoso
              <br />
              Director of Engineering
            </p>
            <p>
              8 minute read
              <br />
              18 September 2026
            </p>
          </aside>
          <ArticleBody>
            <p>
              Resilience is often discussed as inventory, redundancy or
              contingency. In manufacturing systems, it begins much earlier:
              with the architecture of the line itself.
            </p>
            <p>
              The most dependable production cells are not simply overbuilt.
              They are legible. Their functions are modular, their interfaces
              explicit, and their failure modes considered before steel is cut.
            </p>
            <h2>Start with the handoffs</h2>
            <p>
              Every interface is a potential source of uncertainty. Mechanical,
              electrical, controls and operator workflows must be designed as
              one connected system—not as parallel workstreams joined at
              commissioning.
            </p>
            <blockquote>
              “The best time to discover a collision is inside a digital model,
              not during a production ramp.”
            </blockquote>
            <p>
              Digital commissioning lets teams test sequences, access zones and
              recovery states while changes are still inexpensive. It turns
              review from a presentation into a working session.
            </p>
            <h2>Modularity is operational leverage</h2>
            <p>
              A modular cell can absorb product variants, isolate maintenance
              and scale throughput without forcing a complete redesign. The
              value appears not only at launch, but through every year of the
              equipment lifecycle.
            </p>
            <p>
              Good manufacturing engineering makes change less dramatic. That is
              the quiet advantage of designing resilience into the system from
              day one.
            </p>
          </ArticleBody>
        </ArticleGrid>
      </Section>
    </>
  )
}

const CareersPage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.worker} />
      <Section>
        <Split>
          <Reveal data-reveal>
            <Eyebrow>Open roles</Eyebrow>
            <H2>Do work that has weight.</H2>
            <Intro>
              Build real systems with people who care about the last millimetre.
            </Intro>
          </Reveal>
          <List>
            {[
              ['Senior Mechanical Engineer', 'Bandung / Hybrid'],
              ['Automation Engineer', 'Cikarang / On-site'],
              ['Quality Systems Lead', 'Bandung / On-site'],
              ['Graduate Manufacturing Engineer', 'Bandung / On-site'],
            ].map((x, i) => (
              <a href="mailto:careers@atlas-industries.com" key={x[0]}>
                <small>0{i + 1}</small>
                <strong>{x[0]}</strong>
                <span>↗</span>
                <p>{x[1]}</p>
              </a>
            ))}
          </List>
        </Split>
      </Section>
    </>
  )
}

const ContactPage = ({ settings }: { settings: PageSettings }) => {
  return (
    <>
      <StandardHero settings={settings} fallbackImage={images.steel} />
      <Section>
        <Split>
          <Reveal data-reveal>
            <div>
              <Eyebrow>Project enquiries</Eyebrow>
              <H2>Bring us the difficult brief.</H2>
              <Intro>
                Tell us what needs to move, perform or endure. Our engineering
                team will respond within two working days.
              </Intro>
            </div>
          </Reveal>
          <Reveal data-reveal>
            <Form onSubmit={(event) => event.preventDefault()}>
              <label>
                Name
                <input name="name" placeholder="Your name" />
              </label>
              <label>
                Work email
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                />
              </label>
              <label>
                Company
                <input name="company" placeholder="Company name" />
              </label>
              <label>
                Area
                <select name="area" defaultValue="">
                  <option value="" disabled>
                    Select a discipline
                  </option>
                  <option>Precision fabrication</option>
                  <option>Systems integration</option>
                  <option>Industrial automation</option>
                </select>
              </label>
              <label>
                Project brief
                <textarea
                  name="brief"
                  placeholder="Scope, timing and the problem we can help solve"
                />
              </label>
              <button type="submit">
                Send enquiry <span>↗</span>
              </button>
            </Form>
          </Reveal>
        </Split>
      </Section>
      <DarkSection>
        <Split>
          <div>
            <Eyebrow>Visit us</Eyebrow>
            <H2>Bandung engineering campus.</H2>
          </div>
          <DarkIntro>
            Jl. Industri Selatan 18
            <br />
            Bandung, West Java 40286
            <br />
            <br />
            +62 22 555 0187
            <br />
            projects@atlas-industries.com
          </DarkIntro>
        </Split>
      </DarkSection>
    </>
  )
}

export const CompanyPage: React.FC<SectionComponentProps<PageSettings>> = ({
  settings,
}) => {
  const root = useReveal()
  const page = settings.page || 'home'
  const component = {
    home: HomePage,
    about: AboutPage,
    capabilities: CapabilitiesPage,
    industries: IndustriesPage,
    projects: ProjectsPage,
    sustainability: SustainabilityPage,
    insights: InsightsPage,
    article: ArticlePage,
    careers: CareersPage,
    contact: ContactPage,
  }[page]
  return <Page ref={root}>{React.createElement(component, { settings })}</Page>
}
