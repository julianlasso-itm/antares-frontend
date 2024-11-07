import { DomainKnowledge } from './questions-and-answers.interface';

export class PercentageCalculator {
  private readonly _totalQuestions: number;
  private readonly _totalPercentage: number;
  private readonly _domainKnowledges: DomainKnowledge[];
  private readonly _weightsDifferences: number[];
  private readonly _averageWeightDifferences: number;
  private readonly _percentageEachDomainKnowledge: number[];

  constructor(data: {
    totalQuestions: number;
    domainKnowledges: DomainKnowledge[];
  }) {
    this._totalPercentage = 100;
    this._totalQuestions = data.totalQuestions;
    this._domainKnowledges = data.domainKnowledges;
    this._weightsDifferences = this.calculateWeightsDifferences();
    this._averageWeightDifferences = this.calculateAverageWeightDifferences();
    this._percentageEachDomainKnowledge =
      this.calculatePercentageEachDomainKnowledge();
  }

  calculatePercentage(score: number, index: number): number {
    return (
      (score * this._percentageEachDomainKnowledge[index]) /
      this._totalPercentage
    );
  }

  domainKnowledges(): DomainKnowledge[] {
    return this._domainKnowledges;
  }

  private calculateWeightsDifferences(): number[] {
    const weightsDifferences: number[] = [];
    const firstWeight = Number(this._domainKnowledges[0].weight);
    this._domainKnowledges.forEach((domainKnowledge, index) => {
      const weight = Number(domainKnowledge.weight);
      weightsDifferences.push(firstWeight - weight);
    });
    return weightsDifferences;
  }

  private calculateAverageWeightDifferences(): number {
    return (
      this._weightsDifferences.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
        0
      ) / this._weightsDifferences.length
    );
  }

  private calculatePercentageEachDomainKnowledge(): number[] {
    const percentageEachDomainKnowledge: number[] = [];
    this._domainKnowledges.forEach((domainKnowledge, index) => {
      percentageEachDomainKnowledge.push(
        this._totalPercentage / this._totalQuestions -
          this._weightsDifferences[index] +
          this._averageWeightDifferences
      );
    });
    return percentageEachDomainKnowledge;
  }
}
