import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    TestDashboardContent,
    getFileName,
    getSuiteName,
    getCoverageColor,
    formatDuration,
} from "./TestDashboardContent";
import { desc, TestScope, TestType } from "@tests/test-categories";
import { axe } from "jest-axe";

// ── Mock data ─────────────────────────────────

const mockTestResults = {
    numTotalTests: 4,
    numPassedTests: 4,
    numFailedTests: 0,
    numTotalTestSuites: 2,
    numPassedTestSuites: 2,
    numFailedTestSuites: 0,
    startTime: 1700000000000,
    success: true,
    testResults: [
        {
            name: "/src/components/ui/Button/Button.test.tsx",
            status: "passed" as const,
            startTime: 1700000000000,
            endTime: 1700000001000,
            assertionResults: [
                {
                    title: "affiche le contenu enfant",
                    fullName: "[ui] Button — [rendu] > affiche le contenu enfant",
                    status: "passed" as const,
                    duration: 100,
                    failureMessages: [],
                    ancestorTitles: ["[ui] Button — [rendu]"],
                },
                {
                    title: "n'a pas de violations",
                    fullName: "[ui] Button — [a11y] > n'a pas de violations",
                    status: "passed" as const,
                    duration: 200,
                    failureMessages: [],
                    ancestorTitles: ["[ui] Button — [a11y]"],
                },
            ],
        },
        {
            name: "/src/hooks/useTheme.test.ts",
            status: "passed" as const,
            startTime: 1700000001000,
            endTime: 1700000002000,
            assertionResults: [
                {
                    title: "retourne un thème initial valide",
                    fullName: "[hook] useTheme — [rendu] > retourne un thème initial valide",
                    status: "passed" as const,
                    duration: 50,
                    failureMessages: [],
                    ancestorTitles: ["[hook] useTheme — [rendu]"],
                },
                {
                    title: "cycle complet",
                    fullName: "[hook] useTheme — [rendu] > cycle complet",
                    status: "passed" as const,
                    duration: 60,
                    failureMessages: [],
                    ancestorTitles: ["[hook] useTheme — [rendu]"],
                },
            ],
        },
    ],
};

const mockCoverage = {
    total: {
        lines: { pct: 85, total: 100, covered: 85 },
        functions: { pct: 75, total: 40, covered: 30 },
        statements: { pct: 80, total: 120, covered: 96 },
        branches: { pct: 60, total: 50, covered: 30 },
    },
    "/src/components/ui/Button/Button.tsx": {
        lines: { pct: 100, total: 20, covered: 20 },
        functions: { pct: 100, total: 5, covered: 5 },
        statements: { pct: 100, total: 25, covered: 25 },
        branches: { pct: 100, total: 8, covered: 8 },
    },
    "/src/hooks/useTheme.ts": {
        lines: { pct: 45, total: 30, covered: 14 },
        functions: { pct: 50, total: 10, covered: 5 },
        statements: { pct: 45, total: 35, covered: 16 },
        branches: { pct: 30, total: 20, covered: 6 },
    },
};

// ── Setup fetch mock ──────────────────────────

beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockImplementation((url: string) => {
        if (url === "/test-results.json") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve(mockTestResults) });
        }
        if (url === "/coverage/coverage-summary.json") {
            return Promise.resolve({ ok: true, json: () => Promise.resolve(mockCoverage) });
        }
        if (url === "/e2e-results.json" || url === "/lighthouse-scores.json") {
            return Promise.resolve({ ok: false });
        }
        return Promise.reject(new Error("URL inconnue"));
    }));
});

// ── Helpers ───────────────────────────────────

describe(desc(TestScope.PAGE, "TestDashboardContent helpers", TestType.RENDU), () => {
    it("getFileName — nettoie le chemin", () => {
        expect(getFileName("/home/user/project/src/components/Button.tsx"))
            .toBe("src/components/Button");
        expect(getFileName("C:\\project\\src\\hooks\\useTheme.ts"))
            .toBe("src/hooks/useTheme");
    });

    it("getSuiteName — extrait le nom du fichier", () => {
        expect(getSuiteName("/src/components/Button.test.tsx")).toBe("Button");
        expect(getSuiteName("/src/hooks/useTheme.test.ts")).toBe("useTheme");
    });

    it("getCoverageColor — retourne la bonne couleur", () => {
        expect(getCoverageColor(90)).toBe("high");
        expect(getCoverageColor(65)).toBe("mid");
        expect(getCoverageColor(30)).toBe("low");
        expect(getCoverageColor(80)).toBe("high");
        expect(getCoverageColor(50)).toBe("mid");
    });

    it("formatDuration — formate en ms et en secondes", () => {
        expect(formatDuration(500)).toBe("500ms");
        expect(formatDuration(1500)).toBe("1.5s");
        expect(formatDuration(1000)).toBe("1.0s");
    });
});

// ── Rendu ─────────────────────────────────────

describe(desc(TestScope.PAGE, "TestDashboardContent", TestType.RENDU), () => {
    it("affiche le spinner pendant le chargement", () => {
        vi.stubGlobal("fetch", vi.fn().mockImplementation(() => new Promise(() => { })));
        const { container } = render(<TestDashboardContent />);
        expect(container.querySelector("[aria-label='Chargement...']")).toBeInTheDocument();
    });

    it("affiche le message d'erreur si fetch échoue", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
        render(<TestDashboardContent />);
        await waitFor(() => {
            expect(screen.getByText("Données indisponibles.")).toBeInTheDocument();
        });
    });

    it("affiche les stats globales après chargement", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => {
            expect(screen.getByText("4")).toBeInTheDocument();
            expect(screen.getByText("Tests passés")).toBeInTheDocument();
        });
    });

    it("affiche le titre Suites de tests", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => {
            expect(screen.getByText("Suites de tests")).toBeInTheDocument();
        });
    });

    it("affiche les deux colonnes Rendu et Accessibilité", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => {
            expect(screen.getByText("Rendu & Interactions")).toBeInTheDocument();
            expect(screen.getByText("Accessibilité")).toBeInTheDocument();
        });
    });

    it("affiche la section couverture de code", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => {
            expect(screen.getByText("Couverture de code")).toBeInTheDocument();
        });
    });

    it("affiche la section couverture par fichier", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => {
            expect(screen.getByText("Couverture par fichier")).toBeInTheDocument();
        });
    });

    it("affiche les métriques de couverture", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => {
            expect(screen.getByText("lines")).toBeInTheDocument();
            expect(screen.getByText("functions")).toBeInTheDocument();
            expect(screen.getByText("statements")).toBeInTheDocument();
            expect(screen.getByText("branches")).toBeInTheDocument();
        });
    });
});

// ── Interactions ──────────────────────────────

describe(desc(TestScope.PAGE, "TestDashboardContent", TestType.INTERACTIONS), () => {
    it("déplie un describe au clic", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => screen.getAllByText("Button"));
        const btn = screen.getAllByRole("button").find(b => b.textContent?.includes("Button"))!;
        expect(btn).toBeDefined();
        fireEvent.click(btn);
        expect(btn).toHaveAttribute("aria-expanded", "true");
    });

    it("referme un describe au second clic", async () => {
        render(<TestDashboardContent />);
        await waitFor(() => screen.getAllByText("Button"));
        const btn = screen.getAllByRole("button").find(b => b.textContent?.includes("Button"))!;
        fireEvent.click(btn);
        fireEvent.click(btn);
        expect(btn).toHaveAttribute("aria-expanded", "false");
    });
});

describe(desc(TestScope.PAGE, "TestDashboardContent", TestType.A11Y), () => {
  it("n'a pas de violations (état chargé)", async () => {
    const { container } = render(<TestDashboardContent />);
    await waitFor(() => screen.getByText("Suites de tests"));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});